module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tokens', [
      {
        id: '584ac85e-7ba8-4447-9ab3-d85260244830',
        token: '7e4ef6da-3567-4eff-9f3b-b63162825ad3',
        user_id: '530e4075-3643-45e0-85c4-3c6ffd7bbf01',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tokens', null, {});
  },
};
