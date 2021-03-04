import Breed from '../models/Breed';

class BreedController {
  async index(req, res) {
    const breeds = await Breed.findAll({
      attributes: ['id', 'animal', 'breed'],
    });

    return res.json(breeds);
  }
}

export default new BreedController();
