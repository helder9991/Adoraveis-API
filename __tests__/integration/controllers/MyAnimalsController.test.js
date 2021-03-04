import path from 'path';
import request from 'supertest';
import { uuid } from 'uuidv4';

import app from '../../../src/app';

import User from '../../../src/models/User';
import Animal from '../../../src/models/Animal';

let token;
const animal_id = [uuid(), uuid()];
const breed_id = 'af4e8f0e-4eac-4cfa-a646-0f528590c065';

const animalsPhotosPath = path.resolve(
  __dirname,
  '..',
  '..',
  'assets',
  'uploads',
  'animals',
);

describe('My Animal Controller Test', () => {
  beforeEach(async () => {
    // User animal
    const user = await request(app).post('/auth').send({
      email: 'testuser@mail.com',
      password: "nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j",
    });

    token = user.body.token;

    await request(app)
      .post('/my/animals/test')
      .attach('photos', path.resolve(animalsPhotosPath, 'animal1.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal2.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal3.jpg'))
      .field('id', animal_id[0])
      .field('name', 'Rex')
      .field('breed_id', breed_id)
      .field('genre', 'Macho')
      .field('pedigree', 'Não')
      .field('port', 'Médio')
      .field('years_old', 6)
      .field('castrated', 'Não')
      .field('category', 'Adoção')
      .field('vaccines', `V8`)
      .field('observation', 'Pata esquerda quebrada,Orelha furada')
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/my/animals/test')
      .attach('photos', path.resolve(animalsPhotosPath, 'animal1.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal2.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal3.jpg'))
      .field('id', animal_id[1])
      .field('name', 'Pandora')
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
  });

  afterEach(async () => {
    await Animal.destroy({ truncate: true });
  });

  test('should be able to create a new adoptable animal', async () => {
    const id = uuid();
    const response = await request(app)
      .post('/my/animals/test')
      .attach('photos', path.resolve(animalsPhotosPath, 'animal1.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal2.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal3.jpg'))
      .field('id', id)
      .field('name', 'Rex')
      .field('breed_id', breed_id)
      .field('genre', 'Macho')
      .field('pedigree', 'Não')
      .field('port', 'Médio')
      .field('years_old', 6)
      .field('castrated', 'Não')
      .field('category', 'Adoção')
      .field('vaccines', `V8`)
      .field('observation', 'Pata esquerda quebrada,Orelha furada')
      .set('Authorization', `Bearer ${token}`);

    await expect(response.status).toBe(204);
    await request(app).delete(`/my/animals/${id}`);
  });

  test('should not be able to create a new adoptable animal with a wrong field validation', async () => {
    const response = await request(app)
      .post('/my/animals/test')
      .attach('photos', path.resolve(animalsPhotosPath, 'animal1.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal2.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal3.jpg'))
      .field('id', 'wrong-field')
      .field('name', 'wrong-field')
      .field('breed_id', 'wrong-field')
      .field('pedigree', 'wrong-field')
      .field('port', 'wrong-field')
      .field('years_old', 'wrong-field')
      .field('castrated', 'wrong-field')
      .field('category', 'wrong-field')
      .set('Authorization', `Bearer ${token}`);

    await expect(response.body.message).toBe('Validation fails');
  });

  test('should be able to show only my animals', async () => {
    const response = await request(app)
      .get('/my/animals/list')
      .set('Authorization', `Bearer ${token}`);

    await expect(response.status).toBe(200);
  });

  test('should be able to update a animal', async () => {
    const response = await request(app)
      .put(`/my/animals/${animal_id[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Outro nome',
      });

    await expect(response.body.name).toBe('Outro nome');
  });

  test('should not be able to update a animal if user is not a animal owner', async () => {
    await request(app).post('/users').send({
      id: uuid(),
      name: 'Another Person',
      email: 'anotherperson@mail.com',
      password: '12345678',
      phone: '(16)12345-6789',
    });

    const anotherPerson = await request(app).post('/auth').send({
      email: 'anotherperson@mail.com',
      password: '12345678',
    });

    const response = await request(app)
      .put(`/my/animals/${animal_id[0]}`)
      .set('Authorization', `Bearer ${anotherPerson.body.token}`)
      .send({
        name: 'Outro nome',
      });

    await expect(response.body.message).toBe('Permission denied.');
    await User.destroy({
      where: {
        email: 'anotherperson@mail.com',
      },
    });
  });

  test('should be able to delete a animal', async () => {
    const id = uuid();
    await request(app)
      .post('/my/animals/test')
      .attach('photos', path.resolve(animalsPhotosPath, 'animal1.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal2.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal3.jpg'))
      .field('id', id)
      .field('name', 'Rex')
      .field('breed_id', breed_id)
      .field('genre', 'Macho')
      .field('pedigree', 'Não')
      .field('port', 'Médio')
      .field('years_old', 6)
      .field('castrated', 'Não')
      .field('category', 'Adoção')
      .field('vaccines', `V8`)
      .field('observation', 'Pata esquerda quebrada,Orelha furada')
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .delete(`/my/animals/${id}`)
      .set('Authorization', `Bearer ${token}`);

    await expect(response.body.message).toBe('Animal deleted.');
  });

  test('should not be able to delete a animal if user is not a animal owner', async () => {
    await request(app).post('/users').send({
      id: uuid(),
      name: 'Another Person',
      email: 'anotherperson@mail.com',
      password: '12345678',
      phone: '(16)12345-6789',
    });

    const anotherPerson = await request(app).post('/auth').send({
      email: 'anotherperson@mail.com',
      password: '12345678',
    });

    const response = await request(app)
      .delete(`/my/animals/${animal_id[0]}`)
      .set('Authorization', `Bearer ${anotherPerson.body.token}`);

    await expect(response.body.message).toBe('Permission denied.');
  });
});
