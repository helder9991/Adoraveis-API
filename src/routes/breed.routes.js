import { Router } from 'express';

import BreedController from '../controllers/BreedController';

const routes = Router();

routes.get('/', BreedController.index);

export default routes;
