import Animal from '../models/Animal';
import AppError from '../errors/AppError';

class AnimalAdoptController {
  async store(req, res) {
    const { id: animal_id } = req.params;
    const { id: user_id } = req.user;

    // Check if the user is a animal owner
    let animal = await Animal.findByPk(animal_id);

    if (!animal) throw new AppError('Animal does not exists.');

    if (animal.user_id !== user_id) throw new AppError('Permission denied.');

    animal = animal.dataValues;

    try {
      // Update dont return a updated entity in Jest
      await Animal.update(
        { adopted_at: new Date() },
        {
          where: { id: animal.id },
          // logging: console.log,
        },
      );
    } catch (err) {
      throw new AppError('Adopt animal failed.');
    }

    return res.json({ message: 'Animal adopted.' });
  }
}

export default new AnimalAdoptController();
