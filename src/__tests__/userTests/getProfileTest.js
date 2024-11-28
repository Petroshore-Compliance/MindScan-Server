require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;

let userId;

let subscriptionPlanId = 4;
let token;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
    user_type: "individual"
  };

  const response = await request(app)
    .post('/auth/register')
    .send(registrationData);
    
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

    const response2 = await request(app)
      .get('/auth/verificate-user')
      .send(verificationData);

      userId = userData.user_id;

          const verificationData2 = {
            "email": EMAIL_TESTER,
            "password": "secureHashedPassword123"
          }
      
          const response3 = await request(app)
            .post('/auth/login')
            .send(verificationData2);
      
          if (response3.status !== 200) {
            console.log('Response body:', response3.body);
          }
      
          token=response3.body.token;

});


describe('Auth Endpoints', () => {
  it('success get profile; status 200 ', async () => {

    const userData = {
      user_id: userId,
    };

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send(userData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }
    
    expect(response.body.user.email).toBe(EMAIL_TESTER);
    expect(response.status).toBe(200);

  });
});

describe('Auth Endpoints', () => {
  it('fail get profile;no user_id; status 400 ', async () => {

    const userData = {
    };

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send(userData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    
    expect(response.body.errors).toEqual(["User ID cannot be empty."]);
    expect(response.status).toBe(400);

  });
});
describe('Auth Endpoints', () => {
  it('fail get profile;wrong typeof; status 400 ', async () => {

    const userData = {
      user_id: 'userId',

    };

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send(userData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    
    expect(response.body.errors).toEqual(["User ID must be a number."]);
    expect(response.status).toBe(400);

  });
});


// borrado de lo creado
afterAll(async () => {
  await prisma.verificationCode.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
      
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});

