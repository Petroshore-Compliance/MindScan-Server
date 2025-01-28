require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js');
const { EMAIL_TESTER } = process.env;


beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123"
  };

  await request(app)
    .post('/auth/register')
    .send(registrationData);
})

describe('Auth Endpoints', () => {
  it('success set user password; status 200', async () => {


    const verificationData = {

      email: EMAIL_TESTER,
      newPassword: "secureHashedPassword123"
    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }
    expect(response.body).toEqual({ message: 'Password updated successfully' });

    expect(response.status).toBe(200);

  });
});

describe('Auth Endpoints', () => {
  it('fail set password; missing email; status 400', async () => {

    await prisma.user.findUnique({
      where: { email: EMAIL_TESTER },

    })
    const verificationData = {

      newPassword: "secureHashedPassword123"

    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.errors).toEqual([
      "Email cannot be empty."
    ]);
    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('fail set password; missing password; status 400', async () => {

    const verificationData = {

      email: EMAIL_TESTER,
    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.errors).toEqual(["New Password cannot be empty."]);

    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('fail set password; user not exist; status 404', async () => {

    await prisma.user.findUnique({
      where: { email: EMAIL_TESTER },

    })
    const verificationData = {

      email: "juan@sindcuenta.xd",
      newPassword: "secureHashedPassword123"
    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 404) {
      console.log('Response body:', response.body);
    }
    expect(response.body).toEqual({ "message": "User not found" });

    expect(response.status).toBe(404);

  });
});

describe('Auth Endpoints', () => {
  it('fail set password; invalid password; status 400', async () => {


    const verificationData = {

      email: EMAIL_TESTER,
      newPassword: "a"
    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.errors).toEqual(["Invalid new password format."]);

    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('fail set password; wrong typeof; status 400', async () => {

    await prisma.user.findUnique({
      where: { email: EMAIL_TESTER },

    })
    const verificationData = {

      email: 2,
      newPassword: 3
    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.errors).toEqual(["Email must be a string.",
      "New Password must be a string."]);

    expect(response.status).toBe(400);

  });
});

// borrado de lo creado
afterAll(async () => {
  if (EMAIL_TESTER) {
    try {
      // Comprobar la existencia del usuario antes de intentar borrarlo
      const user = await prisma.user.findUnique({ where: { email: EMAIL_TESTER } });

      if (user) {
        await prisma.user.delete({ where: { email: EMAIL_TESTER } });
      }
    } catch (error) {
      console.error('Failed to delete test user:', error);
    }
  }
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
