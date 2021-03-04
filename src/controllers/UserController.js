import * as Yup from 'yup';
import { hash, compare } from 'bcryptjs';

import User from '../models/User';
import AppError from '../errors/AppError';

class UserController {
  async show(req, res) {
    const { id } = req.user;

    const user = await User.findByPk(id, {
      attributes: ['name', 'email', 'phone'],
    });

    if (!user) throw new AppError('User does not exists.', 400);

    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8),
      phone: Yup.string()
        .required()
        .matches(
          /\(\d{2}\)([0-9]{4}|[0-9]{5})-[0-9]{4}/,
          'Phone number is not in a correct format',
        ) // (00)1234-5678 || (00)12345-6789
        .min(13)
        .max(14),
    });

    if (!(await schema.isValid(req.body)))
      throw new AppError('Validation fails', 400);

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) throw new AppError('User already exists.', 400);

    const hashedPassword = await hash(req.body.password, 8);

    await User.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(204).send();
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldPassword: Yup.string(),
      password: Yup.string().when('oldPassword', {
        is: oldPassword => oldPassword === null,
        then: Yup.string().required(),
      }),
      phone: Yup.string()
        .matches(
          /\(\d{2}\)([0-9]{4}|[0-9]{5})-[0-9]{4}/,
          'Phone number is not in a correct format',
        ) // (00)1234-5678 || (00)12345-6789
        .min(13)
        .max(14),
    });

    if (!(await schema.isValid(req.body)))
      throw new AppError('Validation fails', 400);

    const { id } = req.user;

    let user = await User.findByPk(id, {
      attributes: ['name', 'phone', 'password'],
    });

    if (!user) throw new AppError('User does not exists.');

    const { oldPassword } = req.body;
    let password;

    if (oldPassword) {
      if (!(await compare(oldPassword, user.password)))
        throw new AppError('User password does not match.');

      password = await hash(req.body.password, 8);
    }

    try {
      await User.update(
        { ...req.body, password: password || user.password },
        {
          where: { id },
          // returning: true,
        },
      );
    } catch (err) {
      throw new AppError('Update user failed.');
    }

    user = user.dataValues;
    user = { ...user, ...req.body };
    delete user.password;
    delete user.oldPassword;

    return res.json(user);
  }
}

export default new UserController();
