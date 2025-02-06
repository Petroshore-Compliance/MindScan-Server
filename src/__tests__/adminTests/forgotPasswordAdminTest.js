require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let petroAdminId
let token

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response = await request(app).post("/admin/create").send(registrationData);

  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER },
  });

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
  it("success forgot password; status 200", async () => {
    const registrationData = {
      email: EMAIL_TESTER,
    };

    const response = await request(app).post("/admin/forgot-password").send(registrationData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(200);
  });
});

describe("admin Endpoints", () => {
  it("fail forgot password;email not exists; status 400", async () => {
    const registrationData = {
      email: "wrongEmail@petroshorecompliance.com",
    };

    const response = await request(app).post("/admin/forgot-password").send(registrationData);

    if (response.status !== 404) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Email not found." });
  });
});

describe("admin Endpoints", () => {
  it("fail forgot password;email not valid; status 400", async () => {
    const registrationData = {
      email: "invalidEmail",
    };

    const response = await request(app).post("/admin/forgot-password").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid email format." });
  });
});

describe("admin Endpoints", () => {
  it("fail forgot password;no email; status 400", async () => {
    const registrationData = {};

    const response = await request(app).post("/admin/forgot-password").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ message: "Email cannot be empty." });
    expect(response.status).toBe(400);
  });
});

describe("admin Endpoints", () => {
  it("fail forgot password;email is not a string; status 400", async () => {
    const registrationData = {
      email: 33,
    };

    const response = await request(app).post("/admin/forgot-password").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ message: "Email must be a string." });
    expect(response.status).toBe(400);
  });
});

// borrado de  lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
