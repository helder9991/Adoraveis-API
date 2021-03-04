import { Router } from 'express';
import multer from 'multer';

import UserController from '../controllers/UserController';
import MyAnimalsController from '../controllers/MyAnimalsController';
import AnimalAdoptController from '../controllers/AnimalAdoptController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import getRegion from '../middlewares/getRegion';

import { animalUpload } from '../config/multer';

const routes = Router();
const upload = multer(animalUpload);

// Only users authenticated
routes.use(ensureAuthenticated);

// User model
routes.get('/user', UserController.show);
routes.put('/user', UserController.update);

// Animal Model
routes.post(
  '/animals/:region',
  getRegion,
  upload.array('photos', 10),
  MyAnimalsController.store,
);
routes.get('/animals/list/count', MyAnimalsController.count);
routes.get('/animals/list', MyAnimalsController.index);
routes.put('/animals/:id', MyAnimalsController.update);
routes.delete('/animals/:id', MyAnimalsController.delete);

routes.patch('/animals/adopt/:id', AnimalAdoptController.store);

export default routes;
