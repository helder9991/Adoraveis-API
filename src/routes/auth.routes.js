import { Router } from 'express';
import AuthenticationController from '../controllers/AuthenticationController';

const routes = Router();

routes.post('/', AuthenticationController.store);

export default routes;
