import Sequelize, { Model } from 'sequelize';

class Breed extends Model {
  static init(sequelize) {
    super.init(
      {
        animal: Sequelize.STRING,
        breed: Sequelize.STRING,
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Animal, { foreignKey: 'breed_id', as: 'breeds' });
  }
}

export default Breed;
