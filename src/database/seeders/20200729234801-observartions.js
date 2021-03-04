module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkInsert('observations', []);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('observations', null, {});
  },
};
