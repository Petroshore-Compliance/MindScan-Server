require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;

let userId;


/* beforeAll:
1- Registrar usuario para ser encontrado
*/
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

    await request(app)
      .get('/auth/verificate-user')
      .send(verificationData);

      userId = userData.user_id;

    
});



describe('Auth Endpoints', () => {
  it('success get profile; status 200 ', async () => {

    const userData = {
      user_id: userId,
    };

    const response = await request(app)
      .get('/users/me')
      .send(userData);

    if (response.status !== 200) {
      //console.log('Response body:', response);
    }
    
    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(EMAIL_TESTER);

  });
});


// borrado de lo creado
afterAll(async () => {
  await prisma.verificationCode.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
      
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});

