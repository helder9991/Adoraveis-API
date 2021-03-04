import { Router } from 'express';

import AdminController from '../controllers/AdminController';
import ensureSystemAdmin from '../middlewares/ensureSystemAdmin';

const routes = Router();

routes.use(ensureSystemAdmin);
routes.get('/admins', AdminController.index);
routes.post('/admins', AdminController.store);
routes.delete('/admins/:id', AdminController.delete);

export default routes;
