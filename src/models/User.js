import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        phone: Sequelize.INTEGER,
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Animal, { foreignKey: 'user_id', as: 'animal' });
    this.hasOne(models.Administrator, {
      foreignKey: 'user_id',
      as: 'administrator',
    });
  }
}

export default User;
