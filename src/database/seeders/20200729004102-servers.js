module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('servers', [
      {
        id: '7d6335b8-5d29-412b-b3ed-3ef1b7bf8eb6',
        institute: 'ONG Patas Amigas',
        city: 'Passos',
        state: 'Minas gerais',
        logo:
          '1604464355540-5e96fbefa4087955b19f-Screenshot-from-2020-11-04-01-31-32.png',
        url_param: 'patas-amigas',
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Test
      {
        id: '50c0f79b-ddc9-48dd-9bf1-2686e91c1f22',
        institute: 'Test',
        city: 'Test',
        state: 'Test',
        logo: 'logotest.png',
        url_param: 'test',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '507950d3-2d2f-4ca3-b469-0d17a7c68ac4',
        institute: 'Test2',
        city: 'Test2',
        state: 'Test2',
        logo: 'logotest.png',
        url_param: 'test2',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('servers', null, {});
  },
};
