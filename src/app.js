import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';

// Importação do Banco de Dados
import './database';

// Importação das rotas da aplicacao
import routes from './routes';

// Importação das configuracoes
import { animalUploadFolder, logosUploadFolder } from './config/multer';

import AppError from './errors/AppError';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', express.static(animalUploadFolder));
app.use('/files', express.static(logosUploadFolder));

app.use(routes);

// Errors message
app.use((err, req, res, _) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  });
});

export default app;
