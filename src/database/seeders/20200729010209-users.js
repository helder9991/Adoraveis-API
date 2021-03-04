module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        id: '47275fe6-cdf3-455e-91df-beb4f14c4534',
        name: 'System Admin',
        email: 'system@admin.com',
        password:
          '$2a$08$A2Ob5ERuv5a2kctuaYgoBec0BGOJJsFtyKfevZI50ak13ztZ.dSDq', // Dz7's=EgJra-n7c;hCdse$a=g{~_Hr@:%m_ztNF5
        phone: '(22)22222-2222',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '6bebc329-904d-482c-bd12-f6a192efa898',
        name: 'Patas',
        email: 'patas@admin.com',
        password:
          '$2a$08$Aidn9KIxmKBP.u6SiTNiX.KQwwyYRm9wdUteRD8mgJ4Iwz5mHJmZe', // patasamigas123
        phone: '(22)22222-2222',
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Testes
      {
        id: 'fb7d2ea4-225f-4145-bc1b-3a38fc12c78a',
        name: 'Test Admin',
        email: 'test@admin.com',
        password:
          '$2a$08$nv95zV8DpIrLxg77zWo5meedw.mcNrS4LqUg3Pyb9TGkI8hg5ROl2', // nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j
        phone: '(22)22222-2222',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '846d3ddf-12b5-40bc-9ef1-19e51454a27b',
        name: 'Test Admin 2',
        email: 'test2@admin.com',
        password:
          '$2a$08$nv95zV8DpIrLxg77zWo5meedw.mcNrS4LqUg3Pyb9TGkI8hg5ROl2', // nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j
        phone: '(22)22222-2222',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '530e4075-3643-45e0-85c4-3c6ffd7bbf01',
        name: 'Test User',
        email: 'testuser@mail.com',
        password:
          '$2a$08$nv95zV8DpIrLxg77zWo5meedw.mcNrS4LqUg3Pyb9TGkI8hg5ROl2', // nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j
        phone: '(22)22222-2222',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
