module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('administrators', {
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
      permission: {
        type: Sequelize.STRING(12),
        allowNull: false,
        defaultValue: 'admin',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: async (queryInterface, Sequelize) =>
    queryInterface.dropTable('administrators'),
};
