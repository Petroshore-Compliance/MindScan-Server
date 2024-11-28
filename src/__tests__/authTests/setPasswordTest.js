require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;


beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
    user_type: "individual"
  };

  await request(app)
    .post('/auth/register')
    .send(registrationData);
})

describe('Auth Endpoints', () => {
  it('set user password preverificación; status 200', async () => {

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
  it('verificate user; status 400', async () => {

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
  it('fail set password; missing id; status 400', async () => {

 await prisma.user.findUnique({
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
    expect(response.body.errors).toEqual([
           "User id cannot be empty."
         ]);
    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('fail set password; missing password; status 400', async () => {

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
    expect(response.body.errors).toEqual(["Password cannot be empty.", "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit."]);

    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('fail set password; user not exist; status 404', async () => {

 await prisma.user.findUnique({
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
  it('fail set password; invalid password; status 400', async () => {

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
    expect(response.body.errors).toEqual(["Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit."]);

    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('fail set password; wrong typeof; status 400', async () => {

 await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})
    const verificationData = {
      
user_id: "definitivamente esto es un id",
newPassword: 3
    }

    const response = await request(app)
      .patch('/auth/set-password')
      .send(verificationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.errors).toEqual(["Password must be a string.", "User id must be a number.", "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit."]);

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
