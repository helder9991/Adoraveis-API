module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('observations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal(
          process.env.NODE_ENV === 'test' ? ' null' : 'uuid_generate_v4()',
        ),
      },
      animal_id: {
        type: Sequelize.UUID,
        references: {
          model: 'animals',
          key: 'id',
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      observation: {
        type: Sequelize.STRING,
        allowNull: false,
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
    queryInterface.dropTable('observations');
  },
};
