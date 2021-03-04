import { uuid, isUuid } from 'uuidv4';
import { Op } from 'sequelize';
import { subHours } from 'date-fns';
import { hash } from 'bcryptjs';
import path from 'path';
import * as Yup from 'yup';

import Mail from '../services/Mail';
import User from '../models/User';
import Token from '../models/Token';

import AppError from '../errors/AppError';

class ForgotPasswordController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body)))
      throw new AppError('Validation fails', 400);

    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new AppError('User does not exists.', 400);

    const token = uuid();

    await Token.create({
      id: process.env.NODE_ENV === 'test' ? req.body.id : null, // because SQLite does not have a function to generate a random UUIDV4
      user_id: user.id,
      token,
    });

    // Select a e-mail template
    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'mailTemplate',
      'forgotPassword.hbs',
    );

    const mail = new Mail(process.env.NODE_ENV);
    await mail.sendMail({
      templateData: {
        template: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset?token=${token}`,
        },
      },
      to: {
        name: user.name,
        address: user.email,
      },
      subject: 'Recuperação de senha',
      token,
    });

    return res.status(204).send();
  }

  async update(req, res) {
    const { password, token } = req.body;

    const schema = Yup.object().shape({
      password: Yup.string().required().min(8),
    });

    if (!((await schema.isValid({ password })) && isUuid(token)))
      throw new AppError('Validation fails', 400);

    const userToken = await Token.findOne({
      where: {
        [Op.and]: [
          {
            token,
          },
          {
            created_at: {
              [Op.between]: [subHours(new Date(), 2), new Date()], // limit is 3 Months ago
            },
          },
        ],
      },
    });

    if (!userToken) throw new AppError('Token expired or inexistent.', 400);

    await User.update(
      { password: await hash(password, 8) },
      {
        where: {
          id: userToken.user_id,
        },
      },
    );

    return res.status(204).send();
  }
}

export default new ForgotPasswordController();
