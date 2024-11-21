require("dotenv").config();



const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;


let userId;
let token;

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
  it('success update profile; status 200 ', async () => {
    

    const updateProfileData = {
      user_id: userId,
      name: "roman",
      password: "secureHashedPassword123"
      
    }

    const response = await request(app)
      .patch('/users/update-profile')
      .send(updateProfileData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual( 'User profile updated successfully' );

  });
});


describe('Auth Endpoints', () => {
  it('fail update profile; no userId; status 400 ', async () => {
    

    const updateProfileData = {
      name: "roman",
      password: "secureHashedPassword123"
      
    }

    const response = await request(app)
      .patch('/users/update-profile')
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual( 'User id is required' );

  });
});



describe('Auth Endpoints', () => {
  it('fail update profile;invalid password; status 400 ', async () => {
    

    const updateProfileData = {
      user_id: userId,
      name: "roman",
      password: "a"
      
    }

    const response = await request(app)
      .patch('/users/update-profile')
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual( 'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.' );

  });
});

describe('Auth Endpoints', () => {
  it('fail update profile;invalid email; status 400 ', async () => {
    

    const updateProfileData = {
      user_id: userId,
      name: "roman",
      email: "a"
      
    }

    const response = await request(app)
      .patch('/users/update-profile')
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual( 'Invalid email format.' );

  });
});


describe('Auth Endpoints', () => {
  it('fail update profile;invalid name; status 400 ', async () => {
    

    const updateProfileData = {
      user_id: userId,
      name: " h!$·,.",
      
    }

    const response = await request(app)
      .patch('/users/update-profile')
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual( 'Invalid name format.' );

  });
});


describe('Auth Endpoints', () => {
  it('fail update profile;no data; status 400 ', async () => {
    

    const updateProfileData = {
      user_id: userId      
    }

    const response = await request(app)
      .patch('/users/update-profile')
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual( 'User profile cannot be updated with only user_id' );

  });
});

// borrado de todo lo creado
afterAll(async () => {
  await prisma.verificationCode.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
