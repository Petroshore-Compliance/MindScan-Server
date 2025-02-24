require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

jest.setTimeout(30000);
const bcrypt = require("bcrypt");
let nuevotoken;

let petroAdminId;
const companyEmail = "compania@company.pou";
let companyId;
const userEmail = "user@user.pou";
let userId;
let tokenAdmin;
let token;
let auxUserId;
const emailChangeCompany = "romanraldhc1@gmail.com";
let invitationtoken;
let invitationTokenn;

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

});



describe("Auth Endpoints", () => {
  it("success create invitation; status 200 ", async () => {
    await prisma.company.updateMany({
      data: {
        licenses: 1000,
      },
    });
    await prisma.user.updateMany({
      data: {
        company_id: companyId,
      },
    });

    await prisma.user.create({
      data: {
        name: "user",
        email: emailChangeCompany,
        password: await bcrypt.hash("secureHashedPassword123", 10),
        company_id: companyId,
      },
    });

    const companyRegistrationData = {
      name: "La wagoneta",
      email: "testy@test.com",
      user_id: userId,
    };
    await request(app)
      .post("/companies/create-company")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .query({ role: "manager" })
      .send(companyRegistrationData);

    const invitationData = {

      guest: emailChangeCompany,

    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    console.log("Response bodyyyyyyy:", response.body);

    invitationTokenn = response.body.invitation.invitation_token;
    if (response.status !== 201) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("Invitation created successfully");
    expect(response.status).toBe(201);

    await request(app).post("/auth/registerUser").query({ role: "manager" })
      .send(invitationData);
  });
});

describe("Auth Endpoints", () => {
  it("fail change company;not authorized; status 403 ", async () => {
    console.log("invitationTokenn", invitationTokenn);

    const changeCompanyData = {

      token: invitationTokenn

    };
    const response = await request(app)
      .patch("/companies/company-change")
      .set("Authorization", `Bearer ${token}`)
      .send(changeCompanyData);

    if (response.status !== 403) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("You are not authorized to change company");
    expect(response.status).toBe(403);

  });
});


describe("Auth Endpoints", () => {
  it("success change company; status 200 ", async () => {

    const loginDataUser = {
      email: emailChangeCompany,
      password: "secureHashedPassword123",
    };

    const loggedUser = await request(app)
      .post("/auth/login")
      .query({ role: "manager" })
      .send(loginDataUser);

    console.log(loggedUser.body)
    nuevotoken = loggedUser.body.token;

    const changeCompanyData = {

      token: invitationTokenn

    };
    const response = await request(app)
      .patch("/companies/company-change")
      .set("Authorization", `Bearer ${nuevotoken}`)
      .send(changeCompanyData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("Company changed successfully");
    expect(response.status).toBe(200);

  });
});


describe("Auth Endpoints", () => {
  it("fail change company;already in company; status 409 ", async () => {


    console.log("invitationTokenn", invitationTokenn);

    const changeCompanyData = {

      token: invitationTokenn

    };
    const response = await request(app)
      .patch("/companies/company-change")
      .set("Authorization", `Bearer ${nuevotoken}`)
      .send(changeCompanyData);

    if (response.status !== 409) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("You are already in this company");
    expect(response.status).toBe(409);

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
