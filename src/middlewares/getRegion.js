import AppError from '../errors/AppError';
import Server from '../models/Server';

export default async function getRegion(req, res, next) {
  try {
    req.region = req.params.region;

    const region = await Server.findOne({
      where: {
        url_param: req.region,
      },
    });

    req.region_id = region.id;
    return next();
  } catch (err) {
    throw new AppError('Region not found', 401);
  }
}
