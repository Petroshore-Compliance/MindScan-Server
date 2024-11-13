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



describe('Auth Endpoints', () => {
  it('should set the password of a user and return a 200 status', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})
    const verificationData = {
      
user_id: userData.user_id,
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
  it('should try to set the password of an user without an id and return a 400 status', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
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
    expect(response.body).toEqual({ message: 'User ID is required.' });
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('should set try to set the password of a user without a new password and return a 400 status', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})
    const verificationData = {
      
user_id: userData.user_id
    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body).toEqual({ message: 'New password is required.' });

    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('should try to set the password of a user that doesnt exist and return a 404 status', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})
    const verificationData = {
      
user_id: 1,
newPassword: "secureHashedPassword123"
    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 404) {
      console.log('Response body:', response.body);
    }
    expect(response.body).toEqual({ message: 'User not found' });

    expect(response.status).toBe(404);

  });
});

describe('Auth Endpoints', () => {
  it('should try to set a unvalid password onto a user and return a 400 status', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})
    const verificationData = {
      
user_id: userData.user_id,
newPassword: "a"
    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body).toEqual({ message: 'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.' });

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
