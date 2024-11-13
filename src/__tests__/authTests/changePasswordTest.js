require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;

let UserId;
let token;

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

    const user = await prisma.user.findUnique({ where: { email: EMAIL_TESTER } });
    UserId = user.user_id;

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
  it('should login a user and return a 200 status', async () => {

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})

    const verificationData = {
      "email": "roman.delasheras@petroshorecompliance.com",
      "password": "secureHashedPassword123"
    }

    const response = await request(app)
      .post('/auth/login')
      .send(verificationData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(200);

    token=response.body.token;

  });
});

describe('Auth Endpoints', () => {
  it('should change the password of an user successfully and return a 200 status', async () => {
    const registrationData = {
      "user_id": UserId,
      "password": "secureHashedPassword123",
      "newPassword": "secureHashedPasswor1231"
    };
    
    const response = await request(app)
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }

    expect(response.body.message).toBe("Password changed successfully.");
    expect(response.status).toBe(200);

  });
});

describe('Auth Endpoints', () => {
  it('should try to change the password of an user with a bad old password and return a 400 status', async () => {
    const registrationData = {
      "user_id": UserId,
      "password": "secureHashedPassword123",
      "newPassword": "secureHashedPasswor1231"
    };
    
    const response = await request(app)
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.body.message).toBe("Old password is incorrect.");
    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('should try to change the password of an user with a invalid new password and return a 400 status', async () => {
    const registrationData = {
      "user_id": UserId,
      "password": "secureHashedPasswor1231",
      "newPassword": "a"
    };
    
    const response = await request(app)
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.body.message).toBe("New password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.");
    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('should try to change the password of an user with a the same new password and return a 400 status', async () => {
    const registrationData = {
      "user_id": UserId,
      "password": "secureHashedPasswor1231",
      "newPassword": "secureHashedPasswor1231"
    };
    
    const response = await request(app)
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.body.message).toBe("New password cannot be the same as the old password.");
    expect(response.status).toBe(400);

  });
});
describe('Auth Endpoints', () => {
  it('should try to change the password of an user with a invalid new password and return a 400 status', async () => {
    const registrationData = {
      "user_id": 1,
      "password": "secureHashedPasswor1231",
      "newPassword": "a"
    };
    
    const response = await request(app)
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.body.message).toBe("User not found.");
    expect(response.status).toBe(404);

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
