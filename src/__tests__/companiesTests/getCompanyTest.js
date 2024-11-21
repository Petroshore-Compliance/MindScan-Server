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
          const companyRegistrationData = {
            name: "Test company name",
            email: companyEmail,
            subscription_plan_id: subscriptionPlanId,
            user_id: userId
          };
      
          const companyResponse = await request(app)
            .post('/companies/create-company')
            .set('Authorization', `Bearer ${token}`)
            .send(companyRegistrationData);

            companyId = companyResponse._body.company.company_id;
      
});


describe('Auth Endpoints', () => {
  it('success get company; status 200 ', async () => {
    
    const copmanyData = {
      company_id: companyId,
    };

    const response = await request(app)
      .get('/companies/get-company')
      .set('Authorization', `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }
    
    expect(response.body.message).toBe("Company found");
    expect(response.status).toBe(200);

  });
});


describe('Auth Endpoints', () => {
  it('fail get company; not found; status 404 ', async () => {
    
    const copmanyData = {
      company_id: 1,
    };

    const response = await request(app)
      .get('/companies/get-company')
      .set('Authorization', `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 404) {
      console.log('Response body:', response.body);
    }
    
    expect(response.body.message).toBe("Company not found");
    expect(response.status).toBe(404);

  });
});


describe('Auth Endpoints', () => {
  it('fail get company; not id; status 400 ', async () => {
    
    const copmanyData = {
    };

    const response = await request(app)
      .get('/companies/get-company')
      .set('Authorization', `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    
    expect(response.body.message).toBe("company id is required");
    expect(response.status).toBe(400);

  });
});
describe('Auth Endpoints', () => {
  it('fail get company; not id; status 400 ', async () => {
    
    const copmanyData = {
    };

    const response = await request(app)
      .get('/companies/get-company')
      .set('Authorization', `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    
    expect(response.body.message).toBe("company id is required");
    expect(response.status).toBe(400);

  });
});

// borrado de todo lo creado
afterAll(async () => {
  
      
      await prisma.verificationCode.deleteMany();
      await prisma.user.deleteMany();
      await prisma.company.deleteMany();

  
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
