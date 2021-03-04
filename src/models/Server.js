import Sequelize, { Model } from 'sequelize';

class Server extends Model {
  static init(sequelize) {
    super.init(
      {
        institute: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.INTEGER,
        logo: Sequelize.STRING,
        url_param: Sequelize.STRING,
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Administrator, {
      foreignKey: 'server_id',
      as: 'administrator',
    });
    this.hasMany(models.Animal, {
      foreignKey: 'server_id',
      as: 'animal',
    });
  }
}

export default Server;
