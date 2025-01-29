require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

describe("admin Endpoints", () => {
  it("should create a petroAdmin successfully and return a 201 status", async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/admin/create").send(registrationData);

    if (response.status !== 201) {
      console.log("Response body:", response.body);
    }
    expect(response.status).toBe(201);
  });
});

describe("admin Endpoints", () => {
  it("fail create petroadmin; email already in use; status 409", async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/admin/create").send(registrationData);

    if (response.status !== 409) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual("Email already in use");
  });
});

describe("admin Endpoints", () => {
  it("should create try and fail createing a petroAdmin without an email", async () => {
    const registrationData = {
      name: "Alice Smith ",
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/admin/create").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errors: ["Email cannot be empty."] });
  });
});

describe("admin Endpoints", () => {
  it("fail create petroAdmin; no name; status 400", async () => {
    const registrationData = {
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/admin/create").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errors: ["Name cannot be empty."] });
  });
});

describe("admin Endpoints", () => {
  it("fail create petroAdmin; no password; status 400", async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
    };

    const response = await request(app).post("/admin/create").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errors: ["Password cannot be empty."] });
  });
});

describe("admin Endpoints", () => {
  it("fail create petroAdmin; bad typeof; status 400", async () => {
    const registrationData = {
      name: 3,
      email: 3,
      password: 3,
    };

    const response = await request(app).post("/admin/create").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({
      errors: ["Email must be a string.", "Password must be a string.", "Name must be a string."],
    });
    expect(response.status).toBe(400);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
