module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('breeds', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal(
          process.env.NODE_ENV === 'test' ? ' null' : 'uuid_generate_v4()',
        ),
      },
      animal: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      breed: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'Sem raça',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('breeds');
  },
};
