require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

describe("admin Endpoints", () => {
  it("success create petroAdmin; status 201", async () => {
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
    expect(response.body.message).toEqual("petroAdmin registered successfully");
  });
});

describe("admin Endpoints", () => {
  it("login petroAdmin; status 200", async () => {
    const loginData = {
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/admin/login").send(loginData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toEqual("petroAdmin logged in successfully");
    expect(response.status).toBe(200);
    console.log(response.body);
    token = response.body.token;
  });
});

describe("admin Endpoints", () => {
  it("fail login petroAdmin; not email; status 400", async () => {
    const loginData = {
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/admin/login").send(loginData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Email cannot be empty."]);

    token = response.body.token;
  });
});

describe("admin Endpoints", () => {
  it("fail login petroAdmin; not password; status 400", async () => {
    const loginData = {
      email: EMAIL_TESTER,
    };

    const response = await request(app).post("/admin/login").send(loginData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Password cannot be empty."]);

    token = response.body.token;
  });
});

describe("admin Endpoints", () => {
  it("fail login petroAdmin; wrong email; status 404", async () => {
    const verificationData = {
      email: "wrongEmail@petroshorecompliance.com",
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/admin/login").send(verificationData);

    if (response.status !== 404) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Wrong Email or Password" });
  });
});

describe("admin Endpoints", () => {
  it("fail login petroAdmin; wrong password; status 401", async () => {
    const verificationData = {
      email: EMAIL_TESTER,
      password: "secureHashedPasswosssrd123",
    };

    const response = await request(app).post("/admin/login").send(verificationData);

    if (response.status !== 401) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Wrong Email or Password" });
  });
});

describe("admin Endpoints", () => {
  it("fail login petroAdmin; invalid password; status 400", async () => {
    const verificationData = {
      email: EMAIL_TESTER,
      password: "asdfasdfasdf",
    };

    const response = await request(app).post("/admin/login").send(verificationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.",
    ]);
  });
});

describe("admin Endpoints", () => {
  it("fail login petroAdmin; invalid email; status 400", async () => {
    const verificationData = {
      email: "aaaaaasdfsadfasdfa",
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/admin/login").send(verificationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Invalid email format."]);
  });
});

describe("admin Endpoints", () => {
  it("login petroAdmin; wrong typeofs ;status 400", async () => {
    const verificationData = {
      email: 888,
      password: 888,
    };

    const response = await request(app).post("/admin/login").send(verificationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Email must be a string.", "Password must be a string."]);
  });
});

// borrado de todo lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
