import request from 'supertest';

import app from '../../../src/app';

describe('Authentication Controller Test', () => {
  test('should be able to authenticate in application', async () => {
    const response = await request(app).post('/auth').send({
      email: 'testuser@mail.com',
      password: "nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j",
    });

    await expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate in application with the wrong password', async () => {
    const response = await request(app).post('/auth').send({
      email: 'testuser@mail.com',
      password: 'wrong-password',
    });

    expect(response.status).toBe(400);
  });

  it('should not be able to authenticate in application with a non-existing user', async () => {
    const response = await request(app).post('/auth').send({
      email: 'non-existing-user@mail.com',
      password: 'any-password',
    });
    expect(response.status).toBe(400);
  });
});
