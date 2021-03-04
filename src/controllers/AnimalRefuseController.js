import * as Yup from 'yup';

import Animal from '../models/Animal';
import RejectMessage from '../models/RejectMessage';
import AppError from '../errors/AppError';

class AnimalVerifyController {
  async store(req, res) {
    const { id: animal_id } = req.params;
    const { server_id } = req.user;
    const { message } = req.body;

    const schema = Yup.object().shape({
      message: Yup.string().required(),
    });

    if (!(await schema.isValid({ message })))
      throw new AppError('Invalid message', 400);

    // Check if the user is a animal owner
    let animalExists = await Animal.findByPk(animal_id);

    if (!animalExists) throw new AppError('Animal does not exists.');

    if (animalExists.server_id !== server_id)
      throw new AppError('You is not a admin in this ONG.');

    animalExists = animalExists.dataValues;

    try {
      // Update dont return a updated entity in Jest
      await Animal.update(
        { verified_at: new Date(0, 0, 0, 0, 0, 0).setUTCHours(0, 0, 0, 0) },
        {
          where: { id: animalExists.id },
          returning: true,
          // logging: console.log,
        },
      );

      await RejectMessage.create({
        id: process.env.NODE_ENV === 'test' ? req.body.id : null, // because SQLite does not have a function to generate a random UUIDV4
        animal_id,
        message,
      });
    } catch (err) {
      throw new AppError('Verify refused failed.');
    }

    return res.status(204).send();
  }
}

export default new AnimalVerifyController();
