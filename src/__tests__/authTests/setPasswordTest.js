require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let token;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/auth/register").send(registrationData);

  const loginData = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response = await request(app).post("/auth/login").send(loginData);

  token = response.body.token;
});

describe("Auth Endpoints", () => {
  it("success set user password; status 200", async () => {
    const verificationData = {
      token: token,
      password: "secureHashedPassword123",
    };

    const response = await request(app).patch("/auth/set-password").send(verificationData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ message: "Password updated successfully" });

    expect(response.status).toBe(200);
  });
});


describe("Auth Endpoints", () => {
  it("fail set password; missing password; status 400", async () => {
    const verificationData = {
      token: token,
    };

    const response = await request(app).patch("/auth/set-password").send(verificationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["New Password cannot be empty."]);

    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail set password; user not exist; status 404", async () => {
    await prisma.user.deleteMany({
    });
    const verificationData = {
      token: token,
      password: "secureHashedPassword123",
    };

    const response = await request(app).patch("/auth/set-password").send(verificationData);

    if (response.status !== 404) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ message: "User not found" });

    expect(response.status).toBe(404);
  });
});

describe("Auth Endpoints", () => {
  it("fail set password; invalid password; status 400", async () => {
    const verificationData = {
      token: token,
      password: "a",
    };

    const response = await request(app).patch("/auth/set-password").send(verificationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Invalid new password format."]);

    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail set password; wrong typeof; status 400", async () => {

    const verificationData = {
      token: "s",
      password: 3,
    };

    const response = await request(app).patch("/auth/set-password").send(verificationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual([
      "New Password must be a string.",
    ]);

    expect(response.status).toBe(400);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
