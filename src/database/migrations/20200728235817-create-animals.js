module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('animals', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal(
          process.env.NODE_ENV === 'test' ? ' null' : 'uuid_generate_v4()',
        ),
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      server_id: {
        type: Sequelize.UUID,
        references: {
          model: 'servers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      breed_id: {
        type: Sequelize.UUID,
        references: {
          model: 'breeds',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      genre: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      pedigree: {
        type: Sequelize.STRING(3),
      },
      port: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      years_old: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      castrated: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      verified_at: {
        type: Sequelize.DATE,
      },
      adopted_at: {
        type: Sequelize.DATE,
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
    queryInterface.dropTable('animals');
  },
};
