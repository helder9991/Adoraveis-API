import { uuid } from 'uuidv4';
import path from 'path';
import request from 'supertest';

import app from '../../../src/app';

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

describe('Animal Adopt Controller Test', () => {
  beforeEach(async () => {
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

    // Aerify animal
    const admin = await request(app).post('/auth').send({
      email: 'testadmin@mail.com',
      password: "nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j",
    });

    await request(app)
      .patch(`/test/admin/animal/verify/${animal_id}`)
      .set('Authorization', `Bearer ${admin.body.token}`);
  });

  afterAll(async () => {
    await Animal.destroy({ truncate: true });
  });

  it('should be able to put a animal as adopted ', async () => {
    const response = await request(app)
      .patch(`/my/animals/adopt/${animal_id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.message).toBe('Animal adopted.');
  });

  it('should not be able put a animal with a non-user owner', async () => {
    await request(app).post('/users').send({
      id: uuid(),
      name: 'John Doe',
      email: 'john@mail.com',
      password: '12345678',
      phone: '(16)12345-6789',
    });

    const user = await request(app).post('/auth').send({
      email: 'john@mail.com',
      password: '12345678',
    });

    const response = await request(app)
      .patch(`/my/animals/adopt/${animal_id}`)
      .set('Authorization', `Bearer ${user.body.token}`);

    expect(response.body.message).toBe('Permission denied.');
  });
});
