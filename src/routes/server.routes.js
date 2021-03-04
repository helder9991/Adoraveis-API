import { Router } from 'express';
import multer from 'multer';

import ServerController from '../controllers/ServerController';

import ensureSystemAdmin from '../middlewares/ensureSystemAdmin';

import { logoUpload } from '../config/multer';

const routes = Router();
const upload = multer(logoUpload);

routes.get('/', ServerController.index);

routes.use(ensureSystemAdmin);
routes.post('/', upload.array('logo', 1), ServerController.store);
routes.put('/:id', upload.array('logo', 1), ServerController.update);
routes.delete('/:id', ServerController.delete);

export default routes;
