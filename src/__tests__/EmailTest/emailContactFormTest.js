require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js');
const { EMAIL_TESTER } = process.env;



describe('Auth Endpoints', () => {
  it('success create contact; status 201', async () => {
    const registrationData2 = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123"
    };

    await request(app)
      .post('/admin/create')
      .send(registrationData2);


    const formData = {
      name: "Juan Pérez de la Cruz",
      email: "juan.perez@gmail.com",
      phone: "+34623456234",
      language: "ES",
      message: "Estoy interesado en comprar más licencias para mi empresa, he envié un email hace 1 semana y no he recibido respuesta todavía."
    };

    const response = await request(app)
      .post('/contact/create')
      .send(formData);

    if (response.status !== 201) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toEqual("Form created successfully");
    expect(response.status).toBe(201);

  });
});



// borrado de lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.contactForm.deleteMany(); // borrar todos los registros de formularios
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
