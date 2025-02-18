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

});
describe("Auth Endpoints", () => {
  it("success get company; status 200 ", async () => {
    const copmanyData = {

    };

    const response = await request(app)
      .get("/companies/get-employees")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(copmanyData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Employees found");
  });
});







describe("Auth Endpoints", () => {
  it("fail get company; missing role; status 400 ", async () => {
    const copmanyData = {
    };

    const response = await request(app)
      .get("/companies/get-employees")
      .set("Authorization", `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body.errors).toEqual(["Role is required"]);
    expect(response.status).toBe(400);
  });
});




// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
