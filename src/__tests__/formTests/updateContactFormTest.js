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
  it("success update form; status 200 ", async () => {
    const updateFormData = {
      adminEmail: EMAIL_TESTER,

      form_id: formId,
      name: "unanimo",
    };

    const response = await request(app)
      .patch("/contact/update")
      .set("Authorization", `Bearer ${token}`)
      .send(updateFormData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ message: "Form updated successfully" });
    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("fail update form; trying to update message ;status 200 ", async () => {
    const updateFormData = {
      adminEmail: EMAIL_TESTER,

      form_id: formId,
      message: "sañdlkfjaslñkjdf",
    };

    const response = await request(app)
      .patch("/contact/update")
      .set("Authorization", `Bearer ${token}`)
      .send(updateFormData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ errors: ["message cannot be updated"] });
    expect(response.status).toBe(400);
  });
});
describe("Auth Endpoints", () => {
  it("fail update form; only id ;status 200 ", async () => {
    const updateFormData = {
      adminEmail: EMAIL_TESTER,

      form_id: formId,
    };

    const response = await request(app)
      .patch("/contact/update")
      .set("Authorization", `Bearer ${token}`)
      .send(updateFormData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ message: "form cannot be updated with only form_id" });
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail update form; no fields ;status 200 ", async () => {
    const updateFormData = {
      adminEmail: EMAIL_TESTER,
    };

    const response = await request(app)
      .patch("/contact/update")
      .set("Authorization", `Bearer ${token}`)
      .send(updateFormData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ errors: ["Form ID cannot be empty."] });
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail update form; wrong typeof ;status 200 ", async () => {
    const updateFormData = {
      adminEmail: EMAIL_TESTER,

      form_id: "formId",
      name: 3,
      phone: 3,
      language: 3,
    };

    const response = await request(app)
      .patch("/contact/update")
      .set("Authorization", `Bearer ${token}`)
      .send(updateFormData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({
      errors: [
        "Form ID must be a number.",
        "Name must be a string.",
        "Phone must be a string.",
        "Language must be a string.",
      ],
    });
    expect(response.status).toBe(400);
  });
});

afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.user.deleteMany();

  await prisma.contactForm.deleteMany(); // borrar todos los registros de formularios
});
