require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let petroAdminId;

let subscriptionPlanId = 4;
let token;

let formId;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response = await request(app).post("/admin/create").send(registrationData);

  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER.toLowerCase() },
  });

  const registrationData2 = {
    name: "Alice Smith",
    email: "aux@email.com",
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").send(registrationData2);

  petroAdminId = petroAdminData.petroAdmin_id;

  const loginData = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response3 = await request(app).post("/admin/login").send(loginData);

  if (response3.status !== 200) {
    console.log("Response body:", response3.body);
  }

  token = response3.body.token;
});

describe("admin Endpoints", () => {
  it("fail get contactForm;none; status 404 ", async () => {
    const petroAdminData = {
    };

    const response = await request(app)
      .get("/contact/get")
      .set("Authorization", `Bearer ${token}`)
      .send(petroAdminData);

    if (response.status !== 404) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ "message": "No forms found" });

    expect(response.status).toBe(404);
  });
});



describe("admin Endpoints", () => {
  it("success get admin; status 404 ", async () => {
    const petroAdminData = {

      form_id: formId,
    };

    const response = await request(app)
      .get("/contact/get")
      .set("Authorization", `Bearer ${token}`)
      .send(petroAdminData);

    if (response.status !== 404) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toEqual("No forms found");
    expect(response.status).toBe(404);

  });
});


describe("admin Endpoints", () => {
  it("success get contactforms; status 200 ", async () => {


    await prisma.contactForm.create({
      data: {
        name: "name",
        email: "email@email.email",
        phone: "+3434623456234",
        language: "es",
        message: "ayuda",
      },
    });
    await prisma.contactForm.create({
      data: {
        name: "name",
        email: "email@email.email",
        phone: "+3434623456234",
        language: "es",
        message: "ayuda",
      },
    });
    await prisma.contactForm.create({
      data: {
        name: "name",
        email: "email@email.email",
        phone: "+3434623456234",
        language: "es",
        message: "ayuda",
      },
    });
    await prisma.contactForm.create({
      data: {
        name: "name",
        email: "email@email.email",
        phone: "+3434623456234",
        language: "es",
        message: "ayuda",
      },
    });
    const petroAdminData = {

    };

    const response = await request(app)
      .get("/contact/get")
      .set("Authorization", `Bearer ${token}`)
      .send(petroAdminData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toEqual("Forms found successfully");
    expect(response.body.contactForms.length).toBe(4);
    expect(response.status).toBe(200);

  });
});



describe("admin Endpoints", () => {
  it("success get contactforms; status 200 ", async () => {


    await prisma.contactForm.create({
      data: {
        name: "name",
        email: "email@email.email",
        phone: "+3434623456234",
        language: "es",
        message: "ayuda",
      },
    });

    const contactform = await prisma.contactForm.findFirst({});

    formId = contactform.form_id;
    const petroAdminData = {
      form_id: formId
    };

    const response = await request(app)
      .get("/contact/get")
      .set("Authorization", `Bearer ${token}`)
      .send(petroAdminData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toEqual("Form found successfully");
    expect(response.body.contactForms.email).toBe("email@email.email");
    expect(response.status).toBe(200);

  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contactForm.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
