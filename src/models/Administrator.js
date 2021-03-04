import Sequelize, { Model } from 'sequelize';

class Administrator extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.UUID,
        server_id: Sequelize.UUID,
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Server, { foreignKey: 'server_id', as: 'server' });
  }
}

export default Administrator;
