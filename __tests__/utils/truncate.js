import User from '../../src/models/User';

const sequelize = require('../../src/database/index');

export default function truncate() {
  return Promise.all(
    Object.keys(sequelize.models).map(key => {
      return sequelize.models[key].destroy({ truncate: true, force: true });
    }),
  );
}
