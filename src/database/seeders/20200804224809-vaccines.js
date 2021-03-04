module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkInsert('vaccines', []);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vaccines', null, {});
  },
};
