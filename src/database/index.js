import Sequelize from 'sequelize';

// Importação de Models
import Administrator from '../models/Administrator';
import Animal from '../models/Animal';
import AnimalPhoto from '../models/AnimalPhoto';
import Breed from '../models/Breed';
import Observation from '../models/Observation';
import Server from '../models/Server';
import Token from '../models/Token';
import User from '../models/User';
import Vaccine from '../models/Vaccine';
import RejectMessage from '../models/RejectMessage';

// Importação da configuração do banco de dados
import databaseConfig from '../config/database';

export const models = [
  Administrator,
  Animal,
  AnimalPhoto,
  Breed,
  Observation,
  Server,
  Token,
  User,
  Vaccine,
  RejectMessage,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Make a database connection
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
