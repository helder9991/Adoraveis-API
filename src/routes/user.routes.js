import { Router } from 'express';

import UserController from '../controllers/UserController';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const routes = Router();

routes.post('/', UserController.store);
routes.post('/password/forgot', ForgotPasswordController.store);
routes.put('/password/reset', ForgotPasswordController.update);

export default routes;
