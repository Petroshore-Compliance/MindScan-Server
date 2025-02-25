require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const e = require("express");
const { EMAIL_TESTER } = process.env;

let petroAdminId;
const companyEmail = "compania@company.pou";
let companyId;
const userEmail = "user@user.pou";
let userId;
let token;
let tokenUser;

beforeAll(async () => {


  // Register an admin user
  const registrationDataAdmin = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").send(registrationDataAdmin);

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

  const responseAdminLogin = await request(app).post("/admin/login").send(loginDataAdmin);

  token = responseAdminLogin.body.token;


  // Register a regular user
  const registrationDataUser = {
    name: "Alice Smith",
    email: userEmail,
    password: "secureHashedPassword123",
  };

  const u = await request(app).post("/auth/register").set("Authorization", `Bearer ${token}`)
    .send(registrationDataUser);
  console.log(u.body)
  userId = u.body.user.user_id;


  // Create a company associated with the regular user
  const companyRegistrationData = {
    name: "Test company name",
    email: companyEmail,
    user_id: userId,
  };

  const company = await request(app)
    .post("/companies/create-company")
    .set("Authorization", `Bearer ${token}`)
    .send(companyRegistrationData);

  companyId = company.body.company.company_id;

  const auxcompanyRegistrationData = {
    name: "Test company name",
    email: "asdfasf@asdf.asf",
    user_id: userId,
  };

  await request(app)
    .post("/companies/create-company")
    .set("Authorization", `Bearer ${token}`)
    .send(auxcompanyRegistrationData);

  // Log in the regular user
  const loginDataUser = {
    email: userEmail,
    password: "secureHashedPassword123",
  };

  const loggedUser = await request(app).post("/auth/login").send(loginDataUser);
  tokenUser = loggedUser.body.token;

});

describe("Auth Endpoints", () => {
  it("success release employee; status 200 ", async () => {

    await prisma.user.updateMany({

      data: {
        role: "admin",
      },
    });


    const copmanyData = {
      email: userEmail,
    };

    const response = await request(app)
      .patch("/companies/employee-release")
      .set("Authorization", `Bearer ${tokenUser}`)
      .query({ role: "admin" })
      .send(copmanyData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("Employee released");
    expect(response.status).toBe(200);
  });
});


describe("Auth Endpoints", () => {
  it("fail release employee; not part of company; status 404 ", async () => {


    const copmanyData = {
      email: userEmail,
    };

    const response = await request(app)
      .patch("/companies/employee-release")
      .set("Authorization", `Bearer ${tokenUser}`)
      .query({ role: "admin" })
      .send(copmanyData);

    if (response.status !== 404) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("User not a part of the company");
    expect(response.status).toBe(404);
  });
});
// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
