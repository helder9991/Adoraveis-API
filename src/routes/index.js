import { Router } from 'express';

// Importacoes das rotas
import AuthRoutes from './auth.routes';
import AnimalRoutes from './animal.routes';
import AdminRoutes from './admin.routes';
import BreedRoutes from './breed.routes';
import MyRoutes from './my.routes';
import UserRoutes from './user.routes';
import ServerRoutes from './server.routes';
import SystemAdminRoutes from './systemAdmin.routes';

import getRegion from '../middlewares/getRegion';

const routes = Router();

routes.use('/users', UserRoutes);
routes.use('/auth', AuthRoutes);
routes.use('/my', MyRoutes);
routes.use('/breeds', BreedRoutes);
routes.use('/:region/animals', getRegion, AnimalRoutes);
routes.use('/:region/admin/animal', getRegion, AdminRoutes);
routes.use('/servers', ServerRoutes);
routes.use('/system-admin', SystemAdminRoutes);

export default routes;
