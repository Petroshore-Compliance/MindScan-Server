require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let userId;
let token;
let formId;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").send(registrationData);

  const userData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER },
  });

  userId = userData.petroAdmin_id;

  const loginData = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response3 = await request(app).post("/admin/login").send(loginData);

  if (response3.status !== 200) {
    console.log("Response body:", response3.body);
  }

  token = response3.body.token;

  const formData = {
    name: "name",
    email: "email@email.email",
    phone: "+3434623456234",
    language: "es",
    message: "ayuda",
  };

  const response = await request(app).post("/contact/create").send(formData);
  formId = response.body.form.form_id;
});

describe("Auth Endpoints", () => {
  it("success delete form; status 200 ", async () => {
    const deleteFormData = {
      email: EMAIL_TESTER,

      form_id: formId,
    };

    const response = await request(app)
      .delete("/contact/delete")
      .set("Authorization", `Bearer ${token}`)
      .send(deleteFormData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toBe("Form deleted successfully");
    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("fail delete form; missing fields ;status 200 ", async () => {
    const deleteFormData = {
      email: EMAIL_TESTER,
    };

    const response = await request(app)
      .delete("/contact/delete")
      .set("Authorization", `Bearer ${token}`)
      .send(deleteFormData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ errors: ["form_id cannot be empty."] });
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail delete form; wrong typeof ;status 200 ", async () => {
    const deleteFormData = {
      email: EMAIL_TESTER,

      form_id: "formId",
    };

    const response = await request(app)
      .delete("/contact/delete")
      .set("Authorization", `Bearer ${token}`)
      .send(deleteFormData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ errors: ["form_id must be a number."] });
    expect(response.status).toBe(400);
  });
});

afterAll(async () => {
  await prisma.petroAdmin.deleteMany();

  await prisma.user.deleteMany();
  await prisma.contactForm.deleteMany(); // borrar todos los registros de formularios
});
