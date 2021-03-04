import path from 'path';
import { uuid } from 'uuidv4';
import request from 'supertest';

import User from '../../../src/models/User';

import app from '../../../src/app';

let admin_token;
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

describe('Animal Verify Controller Test', () => {
  beforeAll(async () => {
    const admin = await request(app).post('/auth').send({
      email: 'test@admin.com',
      password: "nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j",
    });

    admin_token = admin.body.token;
  });

  beforeEach(async () => {
    animal_id = uuid();
    await request(app)
      .post('/my/animals/test')
      .attach('photos', path.resolve(animalsPhotosPath, 'animal1.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal2.jpg'))
      .attach('photos', path.resolve(animalsPhotosPath, 'animal3.jpg'))
      .field('id', animal_id)
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
      .set('Authorization', `Bearer ${admin_token}`);
  });

  afterAll(async () => {
    Animal.destroy();
  });

  it('should be able verify a animal', async () => {
    const response = await request(app)
      .patch(`/test/admin/animal/verify/${animal_id}`)
      .set('Authorization', `Bearer ${admin_token}`);

    expect(response.body.verified_at).toBeTruthy();
  });

  it('should not be able verify a animal with a non-admin', async () => {
    await request(app).post('/users').send({
      id: uuid(),
      name: 'John Doe',
      email: 'user@mail.com',
      password: '12345678',
      phone: '(16)12345-6789',
    });

    const user = await request(app).post('/auth').send({
      email: 'john@mail.com',
      password: '12345678',
    });

    const response = await request(app)
      .patch(`/test/admin/animal/verify/${animal_id}`)
      .set('Authorization', `Bearer ${user.body.token}`);

    expect(response.status).toBe(401);

    await User.destroy({ where: { email: 'user@mail.com' } });
  });

  it('should not be able verify a animal with a non-admin ong ', async () => {
    const anotherAdmin = await request(app).post('/auth').send({
      email: 'test2@admin.com',
      password: "nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j",
    });

    const response = await request(app)
      .patch(`/test/admin/animal/verify/${animal_id}`)
      .set('Authorization', `Bearer ${anotherAdmin.body.token}`);

    expect(response.body.message).toBe('You is not a admin in this ONG.');
  });
});
