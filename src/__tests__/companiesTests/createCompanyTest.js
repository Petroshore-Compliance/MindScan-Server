require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;

let companyId;
let userId;
let companyEmail = "test@test.com";
let companyEmail2 = "test2@test.com";

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
  it('success create company; status 201 ', async () => {
    const registrationData = {
      name: "Test company name",
      email: companyEmail+'   ',
      subscription_plan_id: subscriptionPlanId,
      user_id: userId
    };

    const response = await request(app)
      .post('/companies/create-company')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 201) {
      console.log('Response body:', response);
    }
    expect(response.status).toBe(201);
expect(response.body.message).toBe('Company created successfully');

  });
});
describe('Auth Endpoints', () => {
  it('fail create company; missing name; status 400 ', async () => {
    const registrationData = {
      email: companyEmail,
      subscription_plan_id: subscriptionPlanId,
      user_id: userId
    };

    const response = await request(app)
      .post('/companies/create-company')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response);
    }
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Name cannot be empty."]);

  });
});
describe('Auth Endpoints', () => {
  it('fail create company; missing email; status 400 ', async () => {
    const registrationData = {
      name: "Test company name",
      subscription_plan_id: subscriptionPlanId,
      user_id: userId
    };

    const response = await request(app)
      .post('/companies/create-company')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response);
    }
    expect(response.status).toBe(400);
expect(response.body.errors).toEqual(["Email cannot be empty."]);

  });
});
describe('Auth Endpoints', () => {
  it('fail create company; missing subscription_plan_id; status 400 ', async () => {
    const registrationData = {
      name: "Test company name",
      email: companyEmail,
      user_id: userId
    };

    const response = await request(app)
      .post('/companies/create-company')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response);
    }
    expect(response.status).toBe(400);
expect(response.body.errors).toEqual(["Subscription plan ID cannot be empty."]);

  });
});
describe('Auth Endpoints', () => {
  it('fail create company; missing user_id ; status 400 ', async () => {
    const registrationData = {
      name: "Test company name",
      email: companyEmail,
      subscription_plan_id: subscriptionPlanId
    };

    const response = await request(app)
      .post('/companies/create-company')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response);
    }
    expect(response.status).toBe(400);
expect(response.body.errors).toEqual(["User ID cannot be empty."]);

  });
});

describe('Auth Endpoints', () => {
  it('fail create company; user of user_id not exist; status 404', async () => {
    const registrationData = {
      name: "Test company name",
      email: companyEmail,
      subscription_plan_id: subscriptionPlanId,
      user_id: 1

    };

    const response = await request(app)
      .post('/companies/create-company')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 404) {
      console.log('Response body:', response);
    }
    expect(response.status).toBe(404);
  expect(response.body.message).toBe('user does not exist');

  });
});


describe('Auth Endpoints', () => {
  it('success create company; but email already in use; status 400', async () => {
    const registrationData = {
      name: "Test company name",
      email: companyEmail,
      subscription_plan_id: subscriptionPlanId,
      user_id: userId

    };

    const response = await request(app)
      .post('/companies/create-company')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 201) {
      console.log('Response body:', response);
    }
    expect(response.status).toBe(201);
  expect(response.body.message).toBe('Company created successfully');

  });
});

describe('Auth Endpoints', () => {
  it('fail create company; invalid plan id; status 400', async () => {
    const registrationData = {
      name: "Test company name",
      email: companyEmail2,
      subscription_plan_id: 2,
      user_id: userId

    };

    const response = await request(app)
      .post('/companies/create-company')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response);
    }
    expect(response.status).toBe(400);
  expect(response.body.message).toBe('Invalid subscription plan ID');

  });
});
describe('Auth Endpoints', () => {
  it('fail create company; wrong typeof; status 400', async () => {
    const registrationData = {
      name: 23,
      email: 23,
      subscription_plan_id: 'sdf',
      user_id: 'userId'

    };

    const response = await request(app)
      .post('/companies/create-company')
      .set('Authorization', `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log('Response body:', response);
    }
    expect(response.status).toBe(400);
  expect(response.body.errors).toEqual(["User ID must be a number.","Subscription plan ID must be a number.", "Email must be a string.", "Name must be a string."]);

  });
});


// borrado de todo lo creado
afterAll(async () => {
    
  await prisma.verificationCode.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
