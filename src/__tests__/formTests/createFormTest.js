require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;


describe('Auth Endpoints', () => {
  it('success create form; status 201', async () => {

    const formData = {
      name: "name",
      email: "email@email.email",
      phone: "+3434623456234",
      language: "es",
      message: "ayuda"
    };

    const response = await request(app)
      .post('/form/create-form')
      .send(formData);

    if (response.status !== 201) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toEqual("Form created successfully");
    expect(response.status).toBe(201);

  });
});


describe('Auth Endpoints', () => {
  it('fail create form; missing fields ;status 201', async () => {

    const formData = {
      
    };

    const response = await request(app)
      .post('/form/create-form')
      .send(formData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.errors).toEqual(["Email cannot be empty.", "Name cannot be empty.", "Phone cannot be empty.", "Language cannot be empty.", "Message cannot be empty."]);
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('fail create form; wrong typeof ;status 201', async () => {

    const formData = {
      name: 3,
      email: 3,
      phone: 3,
      language: 3,
      message: 3
    };

    const response = await request(app)
      .post('/form/create-form')
      .send(formData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.errors).toEqual(["Email must be a string.", "Name must be a string.", "Invalid phone format.", "Language must be a string.", "Message must be a string."]);
    expect(response.status).toBe(400);

  });
});

// borrado de lo creado
afterAll(async () => {
  
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
