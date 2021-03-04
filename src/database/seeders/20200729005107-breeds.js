module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('breeds', [
      {
        id: '8146d747-60a1-4bed-aa4b-f9d0898eb0f0',
        animal: 'Cachorro',
        breed: 'Sem raça',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '1052e32e-4643-4462-afed-fd8fff3c39be',
        animal: 'Cachorro',
        breed: 'Pug',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '091f715a-48c2-49ad-ac4d-a3947939823c',
        animal: 'Cachorro',
        breed: 'Maltês',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '40ba7fe4-347f-4589-b82e-c6095b145f14',
        animal: 'Cachorro',
        breed: 'Shih Tzu',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 'ad5c7ac8-cffd-4e11-870a-7b1399c651f0',
        animal: 'Cachorro',
        breed: 'Buldogue',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '44c3660d-7ea4-4978-ba4d-0e3c833319b9',
        animal: 'Cachorro',
        breed: 'Pit Bull',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 'fc5f8f50-52e1-40bd-8032-0654e0a793a6',
        animal: 'Cachorro',
        breed: 'Spitz Alemão',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '641b3632-e94c-41a7-9865-e2d4f4826a61',
        animal: 'Cachorro',
        breed: 'Dachshund',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 'd113e969-fe1a-4afe-aa14-c0ce559ea24c',
        animal: 'Cachorro',
        breed: 'Pastor-alemão',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 'a5ed3269-7d8d-486a-ac18-b7b12465b20e',
        animal: 'Cachorro',
        breed: 'Basset',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '58410a22-719a-4d83-a7cd-653b30a71a3d',
        animal: 'Cachorro',
        breed: 'Schnauzer',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '662910b1-df94-4b76-a4a4-5076c1a53983',
        animal: 'Cachorro',
        breed: 'Poodle',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '5a0f7c43-1333-4995-811d-5b1559fd9f90',
        animal: 'Cachorro',
        breed: 'Rottweiler',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '6f4f3b97-962d-4413-8676-7795d7f081a2',
        animal: 'Cachorro',
        breed: 'Labrador',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 'af4e8f0e-4eac-4cfa-a646-0f528590c065',
        animal: 'Cachorro',
        breed: 'Pinscher',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '636c894d-fbce-4468-a7b8-9c01d217fdfe',
        animal: 'Cachorro',
        breed: 'Lhasa Apso',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 'b9172ea7-1b94-4422-81f9-58fced805924',
        animal: 'Cachorro',
        breed: 'Golden Retriever',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '2aea4315-4c45-430e-9bd7-33eec53f9460',
        animal: 'Cachorro',
        breed: 'Yorkshire',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '0190d747-d3af-44d1-8f8e-8a29e535d1d1',
        animal: 'Cachorro',
        breed: 'Boder Collie',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '7617c98f-2412-4cdc-8f43-39614e8e9c23',
        animal: 'Cachorro',
        breed: 'Beagle',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: '4899d92b-db2f-43fe-bb75-089558154936',
        animal: 'Gato',
        breed: 'Sem raça',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'b2aac66d-fb73-402e-84b9-c462e972de63',
        animal: 'Gato',
        breed: 'Persa',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'fb3e5986-670d-4ce0-94f3-47712ac3b886',
        animal: 'Gato',
        breed: 'Siamês',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'fdbca336-d3a9-4d41-9c11-5556eea7b4d5',
        animal: 'Gato',
        breed: 'Himalaia',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '6c7e1883-3bd3-4cad-8afc-af99259dbc11',
        animal: 'Gato',
        breed: 'Maine Coon',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'be5a2820-45df-4a04-a8d8-0e34fc1fb147',
        animal: 'Gato',
        breed: 'Angorá',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2aa5a45f-bb1d-4446-a7ce-ea404bdc4b6a',
        animal: 'Gato',
        breed: 'Siberiano',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '6185e6b2-c8fc-4181-91b6-87b39ba9540b',
        animal: 'Gato',
        breed: 'Sphynx',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '8023ced8-9398-4185-898c-b9d1ae32ad78',
        animal: 'Gato',
        breed: 'Burmese',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '8bdd7a1c-6895-48e9-b5b9-3667c36818b7',
        animal: 'Gato',
        breed: 'Ragdoll',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '33f47663-4b36-4d5e-8129-9a5519a5725f',
        animal: 'Gato',
        breed: 'British Shorthair',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('breeds', null, {});
  },
};
