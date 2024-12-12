require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;


describe('Auth Endpoints', () => {
  it('should register a user successfully and return a 201 status', async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 201) {
      console.log('Response body:', response.body);
    }
    expect(response.status).toBe(201);

  });
});

describe('Auth Endpoints', () => {
  it('should try to register a user with an email that already is in use', async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Email already in use');

  });
});

describe('Auth Endpoints', () => {
  it('should register try and fail registering a user without an email', async () => {
    const registrationData = {
      name: "Alice Smith ",
      password: "secureHashedPassword123"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({errors: ["Email cannot be empty."]});

  });
});

describe('Auth Endpoints', () => {
  it('fail register user; no name; status 400', async () => {
    const registrationData = {
      email: EMAIL_TESTER,
      password: "secureHashedPassword123"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({errors: ["Name cannot be empty."]});

  });
});

describe('Auth Endpoints', () => {
  it('fail register user; no password; status 400', async () => {
    const registrationData = {
          name: "Alice Smith",
      email: EMAIL_TESTER
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({errors: ["Password cannot be empty."]});

  });
});

describe('Auth Endpoints', () => {
  it('success verificate user; status 200', async () => {

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

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User verified successfully' });

  });
});

describe('Auth Endpoints', () => {
  it('fail register user; bad typeof; status 400', async () => {
    const registrationData = {
      name: 3,
      email: 3,
      password: 3
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.body).toEqual({"errors": ["Email must be a string.", "Password must be a string.", "Name must be a string."]});
    expect(response.status).toBe(400);

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
