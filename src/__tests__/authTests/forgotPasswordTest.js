require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let UserId;
let token;


let petroAdminId;
let tokenPetroAdmin;


beforeAll(async () => {

  const registrationDataAdmin = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").send(registrationDataAdmin);

  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER.toLowerCase() },
  });

  const registrationData2 = {
    name: "Alice Smith",
    email: "aux@email.com",
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create")
    .set("Authorization", `Bearer ${tokenPetroAdmin}`)
    .send(registrationData2);

  petroAdminId = petroAdminData.petroAdmin_id;

  const loginDataAdmin = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response3Admin = await request(app).post("/admin/login").send(loginDataAdmin);

  if (response3Admin.status !== 200) {
    console.log("Response body:", response3Admin.body);
  }
  tokenPetroAdmin = response3Admin.body.token;


  const registrationDataUser = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const res = await request(app)
    .post("/auth/register")
    .set("Authorization", `Bearer ${tokenPetroAdmin}`)
    .send(registrationDataUser);

  console.log(res.body);














  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/auth/register").send(registrationData);

  const userData = await prisma.user.findUnique({
    where: { email: EMAIL_TESTER.toLowerCase() },
  });

  UserId = userData.user_id;

  const loginData = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response3 = await request(app).post("/auth/login").send(loginData);

  if (response3.status !== 200) {
    console.log("Response body:", response3.body);
  }

  token = response3.body.token;
});
describe("Auth Endpoints", () => {
  it("success forgot password; status 200", async () => {
    const registrationData = {
      email: EMAIL_TESTER,
    };

    const response = await request(app).post("/auth/forgot-password").send(registrationData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("fail forgot password;email not exists; status 400", async () => {
    const registrationData = {
      email: "wrongEmail@petroshorecompliance.com",
    };

    const response = await request(app).post("/auth/forgot-password").send(registrationData);

    if (response.status !== 404) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Email not found." });
  });
});

describe("Auth Endpoints", () => {
  it("fail forgot password;email not valid; status 400", async () => {
    const registrationData = {
      email: "invalidEmail",
    };

    const response = await request(app).post("/auth/forgot-password").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid email format." });
  });
});

describe("Auth Endpoints", () => {
  it("fail forgot password;no email; status 400", async () => {
    const registrationData = {};

    const response = await request(app).post("/auth/forgot-password").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ message: "Email cannot be empty." });
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail forgot password;email is not a string; status 400", async () => {
    const registrationData = {
      email: 33,
    };

    const response = await request(app).post("/auth/forgot-password").send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ message: "Email must be a string." });
    expect(response.status).toBe(400);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
