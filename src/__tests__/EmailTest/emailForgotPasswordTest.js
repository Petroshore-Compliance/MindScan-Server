require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let petroAdminId;
let tokenAdmin;
let UserId;
let token;
beforeAll(async () => {


  // Register an admin user
  const registrationDataAdmin = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").query({ role: "manager" })
    .send(registrationDataAdmin);

  // Fetch the admin user from the database
  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER.toLowerCase() },
  });


  petroAdminId = petroAdminData.petroAdmin_id;

  // Log in the admin user
  const loginDataAdmin = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const responseAdminLogin = await request(app).post("/admin/login").query({ role: "manager" })
    .send(loginDataAdmin);

  tokenAdmin = responseAdminLogin.body.token;





  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response = await request(app).post("/auth/register").set("Authorization", `Bearer ${tokenAdmin}`)
    .send(registrationData);

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

// borrado de lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  await prisma.contactForm.deleteMany(); // borrar todos los registros de formularios
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});