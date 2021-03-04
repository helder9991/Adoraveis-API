module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('administrators', [
      {
        id: 'b226440f-f0ed-441d-b8f2-da1596f3a672',
        user_id: '47275fe6-cdf3-455e-91df-beb4f14c4534',
        server_id: null,
        permission: 'system-admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'f419fe7c-51f2-4f58-862d-e839f24d3847',
        user_id: '6bebc329-904d-482c-bd12-f6a192efa898',
        server_id: '7d6335b8-5d29-412b-b3ed-3ef1b7bf8eb6',
        permission: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Testes
      {
        id: 'fa840a76-db7d-4700-abe5-1bfc177c348c',
        user_id: 'fb7d2ea4-225f-4145-bc1b-3a38fc12c78a',
        server_id: '50c0f79b-ddc9-48dd-9bf1-2686e91c1f22',
        permission: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'cfccc944-97ed-4135-bb0a-82490b8bb4c2',
        user_id: '846d3ddf-12b5-40bc-9ef1-19e51454a27b',
        server_id: '507950d3-2d2f-4ca3-b469-0d17a7c68ac4',
        permission: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('administrators', null, {});
  },
};
