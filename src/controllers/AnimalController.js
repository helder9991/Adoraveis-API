import * as Yup from 'yup';
import { Op } from 'sequelize';
import { subMonths } from 'date-fns';

import Animal from '../models/Animal';

import AppError from '../errors/AppError';

const limit = 21;

class AnimalController {
  async show(req, res) {
    const { id } = req.params;

    let animal = await Animal.findByPk(id, {
      attributes: {
        exclude: ['id', 'breed_id', 'createdAt', 'updatedAt', 'user_id'],
      },
      include: [
        {
          association: 'user',
          attributes: ['name', 'phone'],
        },
        {
          association: 'breed',
          attributes: ['animal', 'breed'],
        },
        {
          association: 'vaccine',
          attributes: ['id', 'name'],
        },
        {
          association: 'observation',
          attributes: ['id', 'observation'],
        },
        {
          association: 'photo',
          attributes: ['name'],
        },
        {
          required: false,
          association: 'message',
          attributes: ['message'],
        },
      ],
    });

    if (!animal) throw new AppError('Animal does not exists.');

    animal = animal.dataValues;
    if (animal.message) animal.message = animal.message.message;

    // // Transforming array of objects in array of strings
    // animal.observation = animal.observation.map(
    //   ({ observation }) => observation,
    // );
    animal.photos = animal.photo.map(
      ({ name }) => `${process.env.APP_API_URL}/files/${name}`,
    );
    delete animal.photo;

    return res.json(animal);
  }

  async count(req, res) {
    let { category } = req.params;
    const {
      animal = '%',
      breed = '%',
      port = '%',
      genre = '%',
      name = '%',
    } = req.query;

    if (category === 'adopt') category = 'Adoção';
    else if (category === 'missing') category = 'Desaparecido';

    const countAnimals = await Animal.count({
      where: {
        [Op.and]: [
          {
            category: {
              [Op.like]: category === 'all' ? '%' : category, // without category filter (%)
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
        ],
        server_id: req.region_id,
        verified_at: {
          [Op.not]: null,
          [Op.not]: new Date(0, 0, 0, 0, 0, 0),
        },
        adopted_at: null,
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
    const { page = 1 } = req.query;

    const schema = Yup.object().shape({
      page: Yup.number().integer(),
    });

    if (!(await schema.isValid({ page })))
      throw new AppError('Invalid page', 400);

    const {
      animal = '%',
      breed = '%',
      port = '%',
      genre = '%',
      name = '%',
    } = req.query;
    let { category } = req.params;

    if (category === 'adopt') category = 'Adoção';
    else if (category === 'missing') category = 'Desaparecido';

    const start = limit * (parseInt(page, 10) - 1);

    let animals = await Animal.findAll({
      // logging: console.log, // Print SQL QUERY
      attributes: ['id', 'name', 'port'],
      where: {
        [Op.and]: [
          {
            category: {
              [Op.like]: category === 'all' ? '%' : category, // without category filter (%)
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
              [Op.like]: `%${name}%`, // without genre filter (%)
            },
          },
          {
            server_id: req.region_id,
          },
          {
            verified_at: {
              [Op.between]: [subMonths(new Date(), 3), new Date()], // limit is 3 Months ago
            },
          },
          {
            adopted_at: null,
          },
        ],
      },
      include: [
        // JOIN
        {
          association: 'breed',
          attributes: ['animal', 'breed'],
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
        {
          association: 'photo',
          attributes: ['name'],
          limit: 1,
        },
      ],
      order: [['verified_at', 'DESC']],
      limit,
      offset: start,
    });

    // Transforming array of objects in array of strings
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
}

export default new AnimalController();
