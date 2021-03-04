import * as Yup from 'yup';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';
import AppError from '../errors/AppError';

import authConfig from '../config/auth';

class AuthenticationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8),
    });

    if (!(await schema.isValid(req.body)))
      throw new AppError('Validation fails', 400);

    const user = await User.findOne({
      where: { email: req.body.email },
      attributes: ['id', 'name', 'email', 'password'],
      include: {
        association: 'administrator',
        attributes: ['permission', 'server_id'],
        include: {
          association: 'server',
          attributes: ['url_param'],
        },
      },
    });

    if (!user) throw new AppError('User does not exists.', 400);

    const passwordMatched = await compare(req.body.password, user.password);

    if (!passwordMatched)
      throw new AppError('User or password does not match.', 400);

    const { expiresIn, secret } = authConfig.jwt;

    let permission = {};
    if (user.administrator) {
      user.administrator = user.administrator.dataValues;

      if (user.administrator.permission === 'admin') {
        permission = {
          permission: 'admin',
          server_id: user.administrator.server_id,
        };
      } else if (user.administrator.permission === 'system-admin') {
        permission = {
          permission: 'system-admin',
        };
      }
    }

    const token = sign({ ...permission }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { name } = user;

    return res.json({
      name,
      permission: permission.permission,
      token,
      ...(user.administrator && user.administrator.server
        ? { url_param: user.administrator.server.url_param }
        : {}),
    });
  }
}

export default new AuthenticationController();
