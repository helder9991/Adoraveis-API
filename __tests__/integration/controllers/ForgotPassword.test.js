import { uuid } from 'uuidv4';
import request from 'supertest';

import app from '../../../src/app';

const token = '7e4ef6da-3567-4eff-9f3b-b63162825ad3';

describe('Forgot Password Controller Test', () => {
  it('should be able to send email', async () => {
    const response = await request(app).post(`/users/password/forgot`).send({
      id: uuid(),
      email: 'test@admin.com',
    });

    expect(response.status).toBe(204);
  });

  it('should not be able to send email with a non-existing user', async () => {
    const response = await request(app).post(`/users/password/forgot`).send({
      id: uuid(),
      email: 'wrong-email@mail.com',
    });

    expect(response.status).toBe(400);
  });

  it('should be able change password with a token', async () => {
    const response = await request(app).put(`/users/password/reset`).send({
      token,
      password: "nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j",
    });

    expect(response.status).toBe(204);
  });

  it('should not be able change password with a wrong token', async () => {
    const response = await request(app).put(`/users/password/reset`).send({
      token: 'wrong-token',
      password: "nPcPDC?Pt^TK.$+sTg79zo36iM'~4%~SX-hFC%9j",
    });

    expect(response.status).toBe(400);
  });
});
