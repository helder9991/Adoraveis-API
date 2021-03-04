import { uuid } from 'uuidv4';
import request from 'supertest';

import app from '../../../src/app';
import User from '../../../src/models/User';

describe('User Controller Test', () => {
  afterEach(async () => {
    await User.destroy({ where: { email: 'john@mail.com' } });
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      id: uuid(),
      name: 'John Doe',
      email: 'user@mail.com',
      password: '12345678',
      phone: '(16)12345-6789',
    });

    expect(response.status).toBe(204);
  });

  it('should not be able to create a new user with a e-mail already exists', async () => {
    await request(app).post('/users').send({
      id: uuid(),
      name: 'John Doe',
      email: 'user@mail.com',
      password: '12345678',
      phone: '(16)12345-6789',
    });

    const response = await request(app).post('/users').send({
      id: uuid(),
      name: 'John Doe 2',
      email: 'user@mail.com',
      password: '12345678',
      phone: '(16)12345-6789',
    });

    expect(response.body.message).toBe('User already exists.');
  });

  it('should be able to show user info', async () => {
    const user = await request(app).post('/auth').send({
      email: 'testuser@mail.com',
      password: "nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j",
    });

    const userInfo = await request(app)
      .get('/my/user')
      .set('Authorization', `Bearer ${user.body.token}`);

    expect(userInfo.body.name).toBe('Test User');
    expect(userInfo.body.email).toBe('testuser@mail.com');
    expect(userInfo.body.phone).toBe('(22)22222-2222');
  });

  it('should be able to update a user a name and phone number', async () => {
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

    const updatedUser = await request(app)
      .put('/my/user')
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        name: 'John Doe 2',
        phone: '(11)12345-6789',
      });

    expect(updatedUser.body.name).toBe('John Doe 2');
    expect(updatedUser.body.phone).toBe('(11)12345-6789');
  });

  it('should be able to update a user a password', async () => {
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

    const updatedUser = await request(app)
      .put('/my/user')
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        oldPassword: '12345678',
        password: '01234567',
      });

    expect(updatedUser.status).toBe(200);
  });
});
