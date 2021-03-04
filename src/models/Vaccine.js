import Sequelize, { Model } from 'sequelize';

class Vaccine extends Model {
  static init(sequelize) {
    super.init(
      {
        animal_id: Sequelize.UUID,
        name: Sequelize.STRING,
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Animal, { foreignKey: 'animal_id', as: 'animal' });
  }
}

export default Vaccine;
