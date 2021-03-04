import { uuid } from 'uuidv4';
import path from 'path';
import request from 'supertest';

import app from '../../../src/app';

import Animal from '../../../src/models/Animal';

let token;
let animal_id;

const breed_id = 'af4e8f0e-4eac-4cfa-a646-0f528590c065';

const animalsPhotosPath = path.resolve(
  __dirname,
  '..',
  '..',
  'assets',
  'uploads',
  'animals',
);

describe('Animal Controller Test', () => {
  beforeAll(async () => {
    const user = await request(app).post('/auth').send({
      email: 'testuser@mail.com',
      password: "nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j",
    });

    token = user.body.token;

    animal_id = uuid();
    await request(app)
      .post('/my/animals/test')
      .attach('photos', path.resolve(animalsPhotosPath, 'animal1.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal2.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal3.jpg'))
      .field('id', animal_id)
      .field('name', 'Bartolomeu')
      .field('breed_id', breed_id)
      .field('genre', 'Fêmea')
      .field('pedigree', 'Não')
      .field('port', 'Pequeno')
      .field('years_old', 6)
      .field('castrated', 'Não')
      .field('category', 'Adoção')
      .field('vaccines', `name: V8`)
      .field('observation', 'Pata esquerda quebrada,Orelha furada')
      .set('Authorization', `Bearer ${token}`);
  });

  afterAll(async () => {
    await Animal.destroy({ truncate: true });
  });

  test('should be able to show one animal by id', async () => {
    const response = await request(app).get(`/test/animals/${animal_id}`);

    await expect(response.body.name).toBe('Bartolomeu');
  });

  test('should be able to show a list of all register animals', async () => {
    await request(app)
      .post('/my/animals/test')
      .attach('photos', path.resolve(animalsPhotosPath, 'animal1.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal2.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal3.jpg'))
      .field('id', uuid())
      .field('name', 'Rex')
      .field('breed_id', breed_id)
      .field('genre', 'Fêmea')
      .field('pedigree', 'Não')
      .field('port', 'Pequeno')
      .field('years_old', 6)
      .field('castrated', 'Não')
      .field('category', 'Adoção')
      .field('vaccines', `V8`)
      .field('observation', 'Pata esquerda quebrada,Orelha furada')
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/my/animals/list')
      .set('Authorization', `Bearer ${token}`);

    let animalsList = response.body;

    animalsList = animalsList.map(animal => animal.name);
    animalsList = animalsList.sort();

    expect(animalsList[0]).toBe('Bartolomeu');
    expect(animalsList[1]).toBe('Rex');
  });
});
