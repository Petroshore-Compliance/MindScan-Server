require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js');
const { EMAIL_TESTER } = process.env;

let petroAdminId;
let token;


beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123"
  };

  await request(app)
    .post('/admin/create')
    .send(registrationData);

  const userData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER },

  })
  petroAdminId = userData.petroAdmin_id;

  const loginData = {
    "email": EMAIL_TESTER,
    "password": "secureHashedPassword123"
  }

  const response3 = await request(app)
    .post('/admin/login')
    .send(loginData);

  if (response3.status !== 200) {
    console.log('Response body:', response3.body);
  }

  token = response3.body.token;

});




describe('Auth Endpoints', () => {
  it('fail delete petroAdmin; missing fields ;status 200 ', async () => {

    const deleteAdminData = {
      email: EMAIL_TESTER,

      petroAdmin_id: "",

    }

    const response = await request(app)
      .delete('/admin/delete')
      .set('Authorization', `Bearer ${token}`)
      .send(deleteAdminData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body).toEqual({ "errors": ["petroAdmin ID cannot be empty."] });
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('fail delete petroAdmin; wrong typeof ;status 200 ', async () => {

    const deleteAdminData = {
      email: EMAIL_TESTER,

      petroAdmin_id: "petroAdminId"

    }

    const response = await request(app)
      .delete('/admin/delete')
      .set('Authorization', `Bearer ${token}`)
      .send(deleteAdminData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body).toEqual({ "errors": ["petroAdmin ID must be a number."] });
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('success delete petroAdmin; status 200 ', async () => {

    const deleteFormData = {
      email: EMAIL_TESTER,

      petroAdmin_id: petroAdminId,
    };

    const response = await request(app)
      .delete('/admin/delete')
      .set('Authorization', `Bearer ${token}`)
      .send(deleteFormData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('petroAdmin deleted successfully');
    expect(response.status).toBe(200);

  });
});


describe('Auth Endpoints', () => {
  it('fauk delete petroAdmin;already deleted; status 200 ', async () => {

    const deleteFormData = {
      email: EMAIL_TESTER,

      petroAdmin_id: petroAdminId,
    };

    const response = await request(app)
      .delete('/admin/delete')
      .set('Authorization', `Bearer ${token}`)
      .send(deleteFormData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.errors).toBe('wrong email');
    expect(response.status).toBe(400);

  });
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.contactForm.deleteMany(); // borrar todos los registros de formularios
});