require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let petroAdminId;
const companyEmail = "compania@company.pou";
let companyId;
const userEmail = "user@user.pou";
let userId;
let token;

beforeAll(async () => {
  // Register a regular user
  const registrationDataUser = {
    name: "Alice Smith",
    email: userEmail,
    password: "secureHashedPassword123",
  };

  await request(app).post("/auth/register").send(registrationDataUser);

  // Log in the regular user
  const loginDataUser = {
    email: userEmail,
    password: "secureHashedPassword123",
  };

  const loggedUser = await request(app).post("/auth/login").send(loginDataUser);

  userId = loggedUser.body.user.user_id;

  // Register an admin user
  const registrationDataAdmin = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").send(registrationDataAdmin);

  // Fetch the admin user from the database
  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER },
  });

  petroAdminId = petroAdminData.petroAdmin_id;

  // Log in the admin user
  const loginDataAdmin = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const responseAdminLogin = await request(app).post("/admin/login").send(loginDataAdmin);

  token = responseAdminLogin.body.token;

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
});

describe("admin Endpoints", () => {
  it("successfully retrieves one company; status 200", async () => {
    const getCompaniesData = {
      company_id: companyId,
    };

    const response = await request(app)
      .get("/admin/get-companies")
      .set("Authorization", `Bearer ${token}`)
      .send(getCompaniesData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    // Update expectation for status code
    expect(response.status).toBe(200);

    // Update expected message
    expect(response.body.message).toEqual("Companies found");
  });
});

describe("admin Endpoints", () => {
  it("successfully retrieves all companies; status 200", async () => {
    const getCompaniesData = {
    };

    const response = await request(app)
      .get("/admin/get-companies")
      .set("Authorization", `Bearer ${token}`)
      .send(getCompaniesData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }
    console.log(response.body); // Update expectation for status code
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Companies found");
  });
});

describe("admin Endpoints", () => {
  it("fail retrieving companies;no token; status 401", async () => {
    const getCompaniesData = {
    };

    const response = await request(app).get("/admin/get-companies").send(getCompaniesData);

    if (response.status !== 401) {
      console.log("Response body:", response.body);
    }
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Acceso denegado");
  });
});

afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // Disconnect Prisma
});
