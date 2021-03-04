import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import * as Yup from 'yup';

import { uuid } from 'uuidv4';
import Animal from '../models/Animal';
import Observation from '../models/Observation';
import Vaccine from '../models/Vaccine';
import AnimalPhoto from '../models/AnimalPhoto';

import { compressAndResize } from '../utils/manipulateImage';

import { animalUploadFolder } from '../config/multer';

import AppError from '../errors/AppError';

const limit = 10;

class MyAnimalController {
  async count(req, res) {
    const { id: user_id } = req.user;
    const {
      animal = '%',
      breed = '%',
      port = '%',
      genre = '%',
      name = '%',
    } = req.query;

    const countAnimals = await Animal.count({
      where: {
        [Op.and]: [
          {
            port: {
              [Op.like]: port, // without port filter (%)
            },
          },
          {
            genre: {
              [Op.like]: genre, // without genre filter (%)
            },
          },
          {
            name: {
              [process.env.NODE_ENV === 'test' ? Op.like : Op.iLike]:
                name !== '%' ? `%${name}%` : name, // SQLite does not have iLike
            },
          },
        ],
        user_id,
      },
      include: [
        // JOIN
        {
          association: 'breed',
          where: {
            [Op.and]: [
              {
                animal: {
                  [Op.like]: animal,
                },
              },
              {
                breed: {
                  [Op.like]: breed, // without port filter (%)
                },
              },
            ],
          },
        },
      ],
    });

    return res.json({ pages: Math.ceil(countAnimals / limit) });
  }

  async index(req, res) {
    const { id: user_id } = req.user;
    const {
      animal = '%',
      breed = '%',
      category = '%',
      genre = '%',
      name = '%',
      port = '%',
      page = 1,
    } = req.query;

    const schema = Yup.object().shape({
      page: Yup.number().integer(),
    });

    if (!(await schema.isValid({ page })))
      throw new AppError('Invalid page', 400);

    const start = limit * (parseInt(page, 10) - 1);

    let animals = await Animal.findAll({
      // logging: console.log, // Print SQL QUERY
      attributes: [
        'id',
        'name',
        'port',
        'genre',
        'verified_at',
        'adopted_at',
        'created_at',
      ],
      where: {
        [Op.and]: [
          {
            category: {
              [Op.like]: category, // without category filter (%)
            },
          },
          {
            port: {
              [Op.like]: port, // without port filter (%)
            },
          },
          {
            genre: {
              [Op.like]: genre, // without genre filter (%)
            },
          },
          {
            name: {
              [process.env.NODE_ENV === 'test' ? Op.like : Op.iLike]:
                name !== '%' ? `%${name}%` : name, // SQLite does not have iLike
            },
          },
          {
            user_id,
          },
        ],
      },
      include: [
        {
          association: 'server',
          attributes: ['url_param'],
        },
        {
          // JOIN
          association: 'breed',
          attributes: ['animal', 'breed'],
          where: {
            [Op.and]: [
              {
                animal: {
                  [Op.like]: animal || '%',
                },
              },
              {
                breed: {
                  [Op.like]: breed || '%', // without port filter (%)
                },
              },
            ],
          },
        },
        {
          association: 'photo',
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset: start,
    });

    if (process.env.NODE_ENV !== 'test') {
      // Jest dont test animal photo routes
      animals = animals.map(currentAnimal => {
        currentAnimal = currentAnimal.dataValues;
        currentAnimal.photo = `${process.env.APP_API_URL}/files/${currentAnimal.photo[0].name}`;
        return currentAnimal;
      });
    }

    return res.json(animals);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      breed_id: Yup.string().required(),
      genre: Yup.string().required().oneOf(['Macho', 'Fêmea']),
      pedigree: Yup.string().required().oneOf(['Não', 'Sim']),
      port: Yup.string().required().oneOf(['Pequeno', 'Médio', 'Grande']),
      years_old: Yup.number().required(),
      castrated: Yup.string().required().oneOf(['Não', 'Sim']),
      category: Yup.string().required().oneOf(['Adoção', 'Desaparecido']),
      vaccines: Yup.array().of(Yup.string()),
      observations: Yup.array().of(Yup.string()),
      photos: Yup.array().min(2).max(10).required(),
    });

    // Convert vaccines and observation strings to JSON
    if (req.body.vaccines) {
      req.body.vaccines = req.body.vaccines.split(',');
    }
    if (req.body.observations) {
      req.body.observations = req.body.observations.split(',');
    }

    const { id } = req.user;
    const { observations, vaccines } = req.body;

    if (!(await schema.isValid({ ...req.body, photos: req.files }))) {
      req.files.forEach(async ({ path: imagePath }) => {
        await fs.promises.unlink(imagePath); // delete this animal saved photos
      });
      throw new AppError('Validation fails', 400);
    }

    // Compress and resize file
    const photosName = await compressAndResize(
      [1080, 580],
      req.files,
      animalUploadFolder,
    );
    // Insert in database
    let animal;
    try {
      animal = await Animal.create({
        ...req.body,
        id: process.env.NODE_ENV === 'test' ? req.body.id : null, // because SQLite does not have a function to generate a random UUIDV4
        user_id: id,
        server_id: req.region_id,
      });

      await AnimalPhoto.bulkCreate(
        photosName.map(filename => ({
          id: process.env.NODE_ENV === 'test' ? uuid() : null, // because SQLite does not have a function to generate a random UUIDV4
          animal_id: animal.id,
          name: filename,
        })),
      );

      if (observations) {
        try {
          await Observation.bulkCreate(
            observations.map(observation => ({
              id: process.env.NODE_ENV === 'test' ? uuid() : null, // because SQLite does not have a function to generate a random UUIDV4
              animal_id: animal.id,
              observation,
            })),
          );
        } catch (err) {
          throw new AppError('Create observations failed');
        }
      }
      if (vaccines) {
        try {
          await Vaccine.bulkCreate(
            vaccines.map(vaccine => ({
              id: process.env.NODE_ENV === 'test' ? uuid() : null, // because SQLite does not have a function to generate a random UUIDV4
              animal_id: animal.id,
              name: vaccine,
            })),
          );
        } catch (err) {
          throw new AppError('Create vaccines failed');
        }
      }
    } catch (err) {
      throw new AppError('Animal creation failed', 400);
    }

    return res.status(204).send();
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      breed_id: Yup.string(),
      genre: Yup.string().equals(['Macho', 'Fêmea']),
      pedigree: Yup.string().equals(['Não', 'Sim']),
      port: Yup.string().equals(['Pequeno', 'Médio', 'Grande']),
      years_old: Yup.number(),
      castrated: Yup.string().equals(['Não', 'Sim']),
      category: Yup.string().equals(['Adoção', 'Desaparecido']),
      vaccines: Yup.array(),
      observations: Yup.array(),
    });

    if (!(await schema.isValid(req.body)))
      throw new AppError('Validation fails', 400);

    const { id: animal_id } = req.params;
    const { id: user_id, permission = '', server_id = '' } = req.user;

    // Check if the user is a animal owner
    let animal = await Animal.findByPk(animal_id);

    if (!animal) throw new AppError('Animal does not exists.');

    if (
      user_id !== animal.user_id &&
      permission !== 'admin' &&
      server_id !== animal.server_id
    )
      throw new AppError('Permission denied.', 401);

    const { observations, vaccines } = req.body;

    try {
      // Update dont return a updated entity in Jest
      await Animal.update(
        { ...req.body, verified_at: null },
        {
          where: { id: animal_id },
          // returning: true,
        },
      );

      if (observations && observations.length > 0) {
        try {
          observations.map(async ({ observation, id }) => {
            await Observation.update(
              {
                observation,
              },
              {
                where: { id },
              },
            );
          });
        } catch (err) {
          throw new AppError('Create observations failed');
        }
      }
      if (vaccines && vaccines.length > 0) {
        try {
          vaccines.map(async ({ vaccine, id }) => {
            await Vaccine.update(
              {
                name: vaccine,
              },
              {
                where: { id },
              },
            );
          });
        } catch (err) {
          throw new AppError('Create vaccines failed');
        }
      }
    } catch (err) {
      throw new AppError('Update animal failed.');
    }

    animal = animal.dataValues;
    animal = { ...animal, ...req.body };

    delete animal.user_id;
    delete animal.verifiedAt;
    delete animal.createdAt;
    delete animal.updatedAt;

    return res.json(animal);
  }

  async delete(req, res) {
    const { id: animal_id } = req.params;
    const { id: user_id, permission = '', server_id = '' } = req.user;

    // Check if the user is a animal owner
    const findAnimal = await Animal.findByPk(animal_id);

    if (!findAnimal) throw new AppError('Animal does not exists.');

    if (
      findAnimal.user_id !== user_id &&
      permission !== 'admin' &&
      server_id !== findAnimal.server_id
    )
      throw new AppError('Permission denied.', 401);

    const filesName = await AnimalPhoto.findAll({
      attributes: ['name'],
      where: {
        animal_id,
      },
    });

    filesName.forEach(async ({ name }) => {
      await fs.promises.unlink(path.resolve(animalUploadFolder, name)); // delete this animal saved photos
    });

    await Animal.destroy({
      where: {
        id: animal_id,
      },
    });

    return res.json({ message: 'Animal deleted.' });
  }
}

export default new MyAnimalController();
