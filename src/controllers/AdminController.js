import * as Yup from 'yup';

import Administrator from '../models/Administrator';
import User from '../models/User';
import AppError from '../errors/AppError';

class SystemAdminController {
  async index(req, res) {
    const admins = await Administrator.findAll({
      attributes: ['id'],
      include: [
        // JOIN
        {
          association: 'user',
          attributes: ['name', 'email'],
        },
        {
          association: 'server',
          attributes: ['institute', 'city'],
        },
      ],
    });
    return res.json(admins);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      server_id: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      throw new AppError('Validation fails', 400);

    const { server_id, email } = req.body;

    const { id: user_id } = await User.findOne({
      attributes: ['id'],
      where: {
        email,
      },
    });

    if (!user_id) throw new AppError('User does not exists.', 400);

    const adminExists = await Administrator.findOne({
      where: { user_id },
    });

    if (adminExists) throw new AppError('Admin already exists.', 400);

    await Administrator.create({
      id: process.env.NODE_ENV === 'test' ? req.body.id : null, // because SQLite does not have a function to generate a random UUIDV4
      user_id,
      server_id,
    });
    return res.status(204).send();
  }

  async delete(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      id: Yup.string().required(),
    });

    if (!(await schema.isValid({ id })))
      throw new AppError('Validation fails', 400);

    const adminExists = await Administrator.findOne({
      where: { id },
    });

    if (!adminExists) throw new AppError('Admin does not exists.', 400);

    await Administrator.destroy({
      where: {
        id,
      },
    });

    return res.json({ message: 'Admin deleted.' });
  }
}

export default new SystemAdminController();
