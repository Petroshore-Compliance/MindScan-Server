require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;


describe('Auth Endpoints', () => {
  it('should register a user successfully and return a 204 status', async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
      user_type: "individual"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 204) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(204);

  });
});

describe('Auth Endpoints', () => {
  it('should try to register a user with an email that already is in use', async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
      user_type: "individual"
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
      name: "Alice Smith",
      password: "secureHashedPassword123",
      user_type: "individual"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({errors: ["All fields are required.","Invalid email format."]});

  });
});

describe('Auth Endpoints', () => {
  it('should register try and fail registering a user without a name', async () => {
    const registrationData = {
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
      user_type: "individual"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({errors: ["All fields are required."]});

  });
});

describe('Auth Endpoints', () => {
  it('should register try and fail registering a user without a password', async () => {
    const registrationData = {
          name: "Alice Smith",
      email: EMAIL_TESTER,
      user_type: "individual"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({errors: ["All fields are required.","Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit."]});

  });
});

describe('Auth Endpoints', () => {
  it('should verificate a user and return a 200 status', async () => {

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
