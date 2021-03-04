import Sequelize, { Model } from 'sequelize';

class Animal extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        breed_id: Sequelize.UUID,
        user_id: Sequelize.UUID,
        server_id: Sequelize.UUID,
        genre: Sequelize.STRING,
        pedigree: Sequelize.STRING,
        port: Sequelize.STRING,
        years_old: Sequelize.INTEGER,
        castrated: Sequelize.STRING,
        category: Sequelize.STRING,
        verified_at: Sequelize.DATE,
        adopted_at: Sequelize.DATE,
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Breed, { foreignKey: 'breed_id', as: 'breed' });
    this.belongsTo(models.Server, { foreignKey: 'server_id', as: 'server' });
    this.hasMany(models.Vaccine, { foreignKey: 'animal_id', as: 'vaccine' });
    this.hasMany(models.Observation, {
      foreignKey: 'animal_id',
      as: 'observation',
    });
    this.hasMany(models.AnimalPhoto, {
      foreignKey: 'animal_id',
      as: 'photo',
    });
    this.hasOne(models.RejectMessage, {
      foreignKey: 'animal_id',
      as: 'message',
    });
  }
}

export default Animal;
