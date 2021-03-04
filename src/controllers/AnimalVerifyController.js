import { Op } from 'sequelize';

import Animal from '../models/Animal';
import AppError from '../errors/AppError';

const limit = 10;

class AnimalVerifyController {
  async count(req, res) {
    const { server_id } = req.user;

    const countAnimals = await Animal.count({
      where: {
        [Op.and]: [
          {
            verified_at: null,
          },
          {
            server_id,
          },
        ],
      },
    });

    return res.json({ pages: Math.ceil(countAnimals / limit) });
  }

  async index(req, res) {
    const { server_id } = req.user;
    const { page = 1 } = req.query;

    const start = limit * (parseInt(page, 10) - 1);

    let animals = await Animal.findAll({
      // logging: console.log, // Print SQL QUERY
      attributes: [
        'id',
        'name',
        'port',
        'category',
        'verified_at',
        'created_at',
      ],
      where: {
        [Op.and]: [
          {
            verified_at: null,
          },
          {
            server_id,
          },
        ],
      },
      include: [
        {
          // JOIN
          association: 'breed',
          attributes: ['animal', 'breed'],
        },
        {
          association: 'photo',
          attributes: ['name'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset: start,
    });

    animals = animals.map(currentAnimal => {
      currentAnimal = currentAnimal.dataValues;
      currentAnimal.photo = `${process.env.APP_API_URL}/files/${currentAnimal.photo[0].name}`;
      return currentAnimal;
    });

    return res.json(animals);
  }

  async store(req, res) {
    const { id: animal_id } = req.params;
    const { server_id } = req.user;

    // Check if the user is a animal owner
    let animalExists = await Animal.findByPk(animal_id);

    if (!animalExists) throw new AppError('Animal does not exists.');

    if (animalExists.server_id !== server_id)
      throw new AppError('You is not a admin in this ONG.');

    animalExists = animalExists.dataValues;

    try {
      // Update dont return a updated entity in Jest
      await Animal.update(
        { verified_at: new Date() },
        {
          where: { id: animalExists.id },
          returning: true,
          // logging: console.log,
        },
      );

      animalExists.verified_at = new Date();
    } catch (err) {
      throw new AppError('Verify animal failed.');
    }

    delete animalExists.user_id;
    delete animalExists.createdAt;
    delete animalExists.updatedAt;

    return res.json(animalExists);
  }
}

export default new AnimalVerifyController();
