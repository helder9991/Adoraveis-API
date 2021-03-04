import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

export default function ensureAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new AppError('JWT token is missing.', 401);

  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, permission = '', server_id } = decoded;

    req.user = {
      id: sub,
    };

    if (permission === 'admin') {
      req.user = {
        ...req.user,
        permission,
        server_id,
      };
    }
    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
}
