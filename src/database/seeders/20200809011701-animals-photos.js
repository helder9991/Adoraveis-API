module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkInsert('animal_photos', []);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('animal_photos', null, {});
  },
};
