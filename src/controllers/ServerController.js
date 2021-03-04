import * as Yup from 'yup';
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';

import Server from '../models/Server';

import { compressAndResize } from '../utils/manipulateImage';

import { logosUploadFolder } from '../config/multer';

import AppError from '../errors/AppError';

class ServerController {
  async index(req, res) {
    let servers = await Server.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      where: {
        url_param: {
          [Op.and]: [
            {
              [Op.ne]: 'test',
            },
            {
              [Op.ne]: 'test2',
            },
          ],
        },
      },
    });

    if (!servers) throw new AppError('Server list not found');

    servers = servers.map(currentServer => {
      currentServer = currentServer.dataValues;
      currentServer.logo = `${process.env.APP_API_URL}/files/${currentServer.logo}`;
      return currentServer;
    });

    return res.json(servers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      institute: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      logo: Yup.string().required(),
      url_param: Yup.string().required(),
    });

    const file = req.files[0];

    if (!(await schema.isValid({ ...req.body, logo: file }))) {
      await fs.promises.unlink(file.path); // delete this saved logo
      throw new AppError('Validation fails', 400);
    }

    // Compress and resize files
    const logoName = await compressAndResize(
      [1080, 580],
      [file], // Need to send a array
      logosUploadFolder,
    );

    await Server.create({
      ...req.body,
      id: process.env.NODE_ENV === 'test' ? req.body.id : null, // because SQLite does not have a function to generate a random UUIDV4
      logo: logoName[0],
      url_param: req.body.url_param.replace(
        /(\s)/g, // get all empty space
        '-',
      ),
    });

    return res.status(204).send();
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      institute: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      logo: Yup.string(),
      url_param: Yup.string(),
    });

    const file = req.files[0];

    if (!(await schema.isValid({ ...req.body, logo: file }))) {
      await fs.promises.unlink(file.path); // delete this saved logo
      throw new AppError('Validation fails', 400);
    }

    // Compress and resize files
    const logoName = await compressAndResize(
      [1080, 580],
      [file], // Need to send a array
      logosUploadFolder,
    );

    const { id: server_id } = req.params;

    // Check if the user is a animal owner
    let server = await Server.findByPk(server_id);

    if (!server) throw new AppError('Server does not exists.');

    // Update dont return a updated entity in Jest
    await Server.update(
      { ...req.body, logo: logoName[0] },
      {
        where: { id: server_id },
        // returning: true,
      },
    );

    server = server.dataValues;
    server = { ...server, ...req.body };

    if (file) {
      // if the user change the logo remove a oldest logo
      await fs.promises.unlink(path.resolve(logosUploadFolder, server.logo));
      // eslint-disable-next-line prefer-destructuring
      server.logo = logoName[0];
    }

    delete server.createdAt;
    delete server.updatedAt;

    return res.json(server);
  }

  async delete(req, res) {
    const { id: server_id } = req.params;

    // Check if the user is a animal owner
    const server = await Server.findByPk(server_id);

    if (!server) throw new AppError('Server does not exists.');

    await Server.destroy({
      where: {
        id: server_id,
      },
    });

    await fs.promises.unlink(path.resolve(logosUploadFolder, server.logo)); // delete this animal saved photos

    return res.json({ message: 'Server deleted.' });
  }
}

export default new ServerController();
