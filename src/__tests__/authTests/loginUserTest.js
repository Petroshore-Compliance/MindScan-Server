require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;

describe('Auth Endpoints', () => {
  it('success register user; status 201', async () => {
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
    expect(response.body.message).toEqual("User registered successfully");

  });
});

describe('Auth Endpoints', () => {
  it('fail login user; not verified; status 401', async () => {

    const verificationData = {
      "email": EMAIL_TESTER,
      "password": "secureHashedPasswosssrd123"
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 401) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'The user is not verified' });
  });
});


describe('Auth Endpoints', () => {
  it('verify user; status 200', async () => {

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
  it('login user; status 200', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})

    const verificationData = {
      "email": EMAIL_TESTER,
      "password": "secureHashedPassword123"
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("User logged in successfully");

    token=response.body.token;

  });
});


describe('Auth Endpoints', () => {
  it('fail login user; not email; status 400', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})

    const verificationData = {
      "password": "secureHashedPassword123"
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Email cannot be empty."]);

    token=response.body.token;

  });
});


describe('Auth Endpoints', () => {
  it('fail login user; not password; status 400', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})

    const verificationData = {
      "email": EMAIL_TESTER
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Password cannot be empty."]);


    token=response.body.token;

  });
});





describe('Auth Endpoints', () => {
  it('fail login user; wrong email; status 400', async () => {

    const verificationData = {
      "email": "wrongEmail@petroshorecompliance.com",
      "password": "secureHashedPassword123"
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Wrong Email or Password' });
  });
});


describe('Auth Endpoints', () => {
  it('fail login user; wrong password; status 400', async () => {

    const verificationData = {
      "email": EMAIL_TESTER,
      "password": "secureHashedPasswosssrd123"
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Wrong Email or Password' });
  });
});


describe('Auth Endpoints', () => {
  it('fail login user; invalid password; status 400', async () => {

    const verificationData = {
      "email": EMAIL_TESTER,
      "password": "asdfasdfasdf"
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit."]);
  });
});

describe('Auth Endpoints', () => {
  it('fail login user; invalid email; status 400', async () => {

    const verificationData = {
      "email": "aaaaaasdfsadfasdfa",
      "password": "secureHashedPassword123"
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Invalid email format."]);
  });
});




describe('Auth Endpoints', () => {
  it('login user; wrong typeofs ;status 400', async () => {


    const verificationData = {
      "email": 888,
      "password": 888
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Email must be a string.", "Password must be a string."]);


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
