import { Router } from 'express';

import AnimalController from '../controllers/AnimalController';

const routes = Router();

routes.get('/:category/count', AnimalController.count);
routes.get('/:id', AnimalController.show);
routes.get('/list/:category', AnimalController.index);

export default routes;
