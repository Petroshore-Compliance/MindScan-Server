require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

jest.setTimeout(30000);

let petroAdminId;
const companyEmail = "compania@company.pou";
let companyId;
const userEmail = "user@user.pou";
let userId;
let tokenAdmin;
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


  // Register a regular user
  const registrationDataUser = {
    name: "Alice Smith",
    email: userEmail,
    password: "secureHashedPassword123",
  };

  const u = await request(app).post("/auth/register").set("Authorization", `Bearer ${tokenAdmin}`)
    .query({ role: "manager" })
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
    .set("Authorization", `Bearer ${tokenAdmin}`)
    .query({ role: "manager" })
    .send(companyRegistrationData);

  companyId = company.body.company.company_id;

  const auxcompanyRegistrationData = {
    name: "Test company name",
    email: "asdfasf@asdf.asf",
    user_id: userId,
  };

  await request(app)
    .post("/companies/create-company")
    .set("Authorization", `Bearer ${tokenAdmin}`)
    .query({ role: "manager" })
    .send(auxcompanyRegistrationData);

  // Log in the regular user
  const loginDataUser = {
    email: userEmail,
    password: "secureHashedPassword123",
  };

  const loggedUser = await request(app).post("/auth/login").query({ role: "manager" })
    .send(loginDataUser);
  token = loggedUser.body.token;


  //añadir licencias parap oder invitar a los usuarios

  await prisma.company.updateMany({
    data: {
      licenses: 1000,
    },
  });


  const invitationData = {

    guest: "exito@invited.com",
    role: "employee",

  };

  const response = await request(app)
    .post("/companies/invite")
    .set("Authorization", `Bearer ${token}`)
    .query({ role: "manager" })
    .send(invitationData);

});


describe("Auth Endpoints", () => {
  it("success register employee; status 201 ", async () => {


    const companyInvitation = await prisma.companyInvitation.findMany({});


    const employeeRegister = {

      name: "Alice Smith",
      password: "secureHashedPassword123",
      token: companyInvitation[0].invitation_token,

    };

    const response = await request(app)
      .post("/auth/employee-register")
      .send(employeeRegister);

    if (response.status !== 201) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ "message": "Employee registered successfully." });
  });
});


describe("Auth Endpoints", () => {
  it("fail register employee; already registered; status 410", async () => {


    const companyInvitation = await prisma.companyInvitation.findMany({});


    const employeeRegister = {

      name: "Alice Smith",
      password: "secureHashedPassword123",
      token: companyInvitation[0].invitation_token,

    };

    const response = await request(app)
      .post("/auth/employee-register")
      .send(employeeRegister);

    if (response.status !== 410) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(410);
    expect(response.body).toEqual({ "message": "Invalid invitation", });
  });
});


describe("Auth Endpoints", () => {
  it("fail register employee; already registered; status 409", async () => {

    await prisma.companyInvitation.updateMany({

      data: {
        status: "pending",
      },
    });
    const companyInvitation = await prisma.companyInvitation.findMany({});


    const employeeRegister = {

      name: "Alice Smith",
      password: "secureHashedPassword123",
      token: companyInvitation[0].invitation_token,

    };

    const response = await request(app)
      .post("/auth/employee-register")
      .send(employeeRegister);

    if (response.status !== 409) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ "message": "Email already in use", });
  });
});



// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
