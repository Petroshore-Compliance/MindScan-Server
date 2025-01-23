require("dotenv").config();



const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js');
const { EMAIL_TESTER } = process.env;

let petroAdminId;
let subscriptionPlanId = 4;
let token;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123"
  };

  const response = await request(app)
    .post('/admin/create')
    .send(registrationData);

  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER },

  })


  petroAdminId = petroAdminData.petroAdmin_id;

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

describe('admin Endpoints', () => {
  it('success update admin; status 200 ', async () => {


    const updateadminData = {
      "adminEmail": EMAIL_TESTER,

      petroAdmin_id: petroAdminId,
      name: "roman",
      password: "secureHashedPassword123"

    }

    const response = await request(app)
      .patch('/admin/update')
      .set('Authorization', `Bearer ${token}`)
      .send(updateadminData);

    if (response.status !== 200) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('petroAdmin updated successfully');

  });
});

describe('admin Endpoints', () => {
  it('fail update admin; no petroAdminId; status 400 ', async () => {


    const updateadminData = {
      "adminEmail": EMAIL_TESTER,

      name: "roman",
      password: "secureHashedPassword123"

    }

    const response = await request(app)
      .patch('/admin/update')
      .set('Authorization', `Bearer ${token}`)
      .send(updateadminData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(['petroAdmin ID cannot be empty.']);

  });
});

describe('admin Endpoints', () => {
  it('fail update admin;invalid password; status 400 ', async () => {


    const updateadminData = {
      "adminEmail": EMAIL_TESTER,

      petroAdmin_id: petroAdminId,
      name: "roman",
      password: "a"

    }

    const response = await request(app)
      .patch('/admin/update')
      .set('Authorization', `Bearer ${token}`)
      .send(updateadminData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Invalid password format."]);

  });
});

describe('admin Endpoints', () => {
  it('fail update admin;invalid email; status 400 ', async () => {

    const updateadminData = {
      "adminEmail": EMAIL_TESTER,

      petroAdmin_id: petroAdminId,
      name: "roman",
      email: "a"

    }

    const response = await request(app)
      .patch('/admin/update')
      .set('Authorization', `Bearer ${token}`)
      .send(updateadminData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Invalid email format."]);

  });
});

describe('admin Endpoints', () => {
  it('fail update admin;invalid name; status 400 ', async () => {


    const updateadminData = {
      "adminEmail": EMAIL_TESTER,

      petroAdmin_id: petroAdminId,
      name: " h!$·,.",
    }

    const response = await request(app)
      .patch('/admin/update')
      .set('Authorization', `Bearer ${token}`)
      .send(updateadminData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Invalid name format."]);

  });
});

describe('admin Endpoints', () => {
  it('fail update admin;no data; status 400 ', async () => {


    const updateadminData = {
      "adminEmail": EMAIL_TESTER,

      petroAdmin_id: petroAdminId
    }

    const response = await request(app)
      .patch('/admin/update')
      .set('Authorization', `Bearer ${token}`)
      .send(updateadminData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toEqual('No fields to update');

    expect(response.status).toBe(400);

  });
});

describe('admin Endpoints', () => {
  it('fail update admin;wrong typeof; status 400 ', async () => {


    const updateadminData = {
      "adminEmail": EMAIL_TESTER,

      petroAdmin_id: "petroAdminId",
      company_id: "companyId",
      name: 33,
      email: 22,
      role: 33,
      password: 33
    }

    const response = await request(app)
      .patch('/admin/update')
      .set('Authorization', `Bearer ${token}`)
      .send(updateadminData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Company ID must be a number.", "petroAdmin ID must be a number.", "Name must be a string.", "Email must be a string.", "Password must be a string.", "Invalid role"]);

  });


  describe('admin Endpoints', () => {
    it('fail update admin;no token; status 400 ', async () => {

      const petroAdminData = {
        "adminEmail": EMAIL_TESTER,

        petroAdmin_id: 'petroAdminId',

      };

      const response = await request(app)
        .get('/admin/get')
        .send(petroAdminData);

      if (response.status !== 401) {
        console.log('Response body:', response.body);
      }

      expect(response.body).toEqual({ "message": "Acceso denegado" });
      expect(response.status).toBe(401);

    });
  });

});

// borrado de lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
