import { Router } from 'express';
import AnimalVerifyController from '../controllers/AnimalVerifyController';
import AnimalRefuseController from '../controllers/AnimalRefuseController';

import ensureAdmin from '../middlewares/ensureAdmin';

const routes = Router();

// Only authenticated users can be call this routes
routes.use(ensureAdmin);
routes.get('/verify', AnimalVerifyController.index);
routes.get('/verify/count', AnimalVerifyController.count);
routes.patch('/verify/:id', AnimalVerifyController.store);
routes.patch('/refuse/:id', AnimalRefuseController.store);

export default routes;
