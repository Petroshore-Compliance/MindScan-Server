require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let token;
let userId;

describe("Auth Endpoints", () => {
  it("success register user; status 201", async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/auth/register").send(registrationData);

    if (response.status !== 201) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body.message).toEqual("User registered successfully");
  });
});

describe("Auth Endpoints", () => {
  it("login user; status 200", async () => {
    const userData = await prisma.user.findUnique({
      where: { email: EMAIL_TESTER },
    });

    const loginData = {
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    userId = response.body.user.user_id;

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("User logged in successfully");
    console.log(response.body);
    token = response.body.token;
  });
});

describe("Auth Endpoints", () => {
  it("success get profile; status 200 ", async () => {
    const userData = {
      user_id: userId,
    };

    const response = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send(userData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("User profile found");
    expect(response.status).toBe(200);
  });
});

// borrado de lo creado
afterAll(async () => {

  await prisma.petroAdmin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
