require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;


let petroAdminId;

let tokenPetroAdmin;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").send(registrationData);

  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER.toLowerCase() },
  });

  const registrationData2 = {
    name: "Alice Smith",
    email: "aux@email.com",
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create")
    .send(registrationData2);

  petroAdminId = petroAdminData.petroAdmin_id;

  const loginData = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response3 = await request(app).post("/admin/login").send(loginData);

  if (response3.status !== 200) {
    console.log("Response body:", response3.body);
  }

  tokenPetroAdmin = response3.body.token;
});

describe("Auth Endpoints", () => {
  it("should register a user successfully and return a 201 status", async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${tokenPetroAdmin}`)
      .send(registrationData);

    if (response.status !== 201) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ message: "User registered successfully" });
    expect(response.status).toBe(201);
  });
});

describe("Auth Endpoints", () => {
  it("fail register user; email already in use; status 409", async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${tokenPetroAdmin}`)
      .send(registrationData);

    if (response.status !== 409) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual("Email already in use");
  });
});

describe("Auth Endpoints", () => {
  it("should register try and fail registering a user without an email", async () => {
    const registrationData = {
      name: "Alice Smith ",
      password: "secureHashedPassword123",
    };

    const response = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${tokenPetroAdmin}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errors: ["Email cannot be empty."] });
  });
});

describe("Auth Endpoints", () => {
  it("fail register user; no name; status 400", async () => {
    const registrationData = {
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${tokenPetroAdmin}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errors: ["Name cannot be empty."] });
  });
});

describe("Auth Endpoints", () => {
  it("fail register user; no password; status 400", async () => {
    const registrationData = {
      name: "Alice Smith",
      email: EMAIL_TESTER,
    };

    const response = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${tokenPetroAdmin}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errors: ["Password cannot be empty."] });
  });
});

describe("Auth Endpoints", () => {
  it("fail register user; bad typeof; status 400", async () => {
    const registrationData = {
      name: 3,
      email: 3,
      password: 3,
    };

    const response = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${tokenPetroAdmin}`)
      .send(registrationData);

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
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
