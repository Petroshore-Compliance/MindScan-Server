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

  const response = await request(app)
    .post('/auth/register')
    .send(registrationData);
})


describe('Auth Endpoints', () => {
  it('verificate user; success; status 200', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})

    const verificationData = {
      "user_id": userData.user_id,
      "verificationCode": userData.VerificationCodes[0].code
    }

    const response = await request(app)
      .get('/auth/verificate-user')
      .send(verificationData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }

    expect(response.body).toEqual({ message: 'User verified successfully' });
    expect(response.status).toBe(200);

  });
});

describe('Auth Endpoints', () => {
  it('fail verificate user; already verificated; status 400', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})

    const verificationData = {
      "user_id": userData.user_id,
      //"verificationCode": userData.VerificationCodes[0].code no va a funcionar porque ya no existe en la bbdd
      "verificationCode": 5464
    }

    const response = await request(app)
      .get('/auth/verificate-user')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'The user is already verified' });

  });
});

describe('Auth Endpoints', () => {
  it('fail verificate user; no email; status 400', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})
    const verificationData = {
      "verificationCode": 2222
    }

    const response = await request(app)
      .get('/auth/verificate-user')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["User id cannot be empty."]);

  });
});

describe('Auth Endpoints', () => {
  it('fail verificate user; no verification code; status 400', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})
    const verificationData = {
      "user_id": userData.user_id
    }

    const response = await request(app)
      .get('/auth/verificate-user')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Verification code cannot be empty."]);

  });
});


describe('Auth Endpoints', () => {
  it('fail verificate user; nwrong types; status 400', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})
    const verificationData = {
      "user_id": "userData.user_id",
      "verificationCode": "userData.VerificationCodes[0].code"
    }

    const response = await request(app)
      .get('/auth/verificate-user')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["User id must be a number.","Verification code must be a number."]);

  });
});


describe('Auth Endpoints', () => {
  it('fail verificate user; user not exists; status 400', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})
    const verificationData = {
      "user_id": 1,
      "verificationCode": 2222
    }

    const response = await request(app)
      .get('/auth/verificate-user')
      .send(verificationData);

    if (response.status !== 404) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toEqual({"message": "User not found"});

  });
});






// borrado de todo lo creado
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
