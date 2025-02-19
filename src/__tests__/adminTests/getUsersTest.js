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

  await request(app).post("/auth/register").set("Authorization", `Bearer ${token}`)
    .send(registrationDataUser);

  // Log in the regular user
  const loginDataUser = {
    email: userEmail,
    password: "secureHashedPassword123",
  };

  const loggedUser = await request(app).post("/auth/login").send(loginDataUser);
  tokenUser = loggedUser.body.token;
  userId = loggedUser.body.user.user_id;

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






  for (let i = 2; i <= 26; i++) {
    const registrationDataUserss = {
      name: `Alice Smith`,
      email: `${i}${userEmail}`,
      password: "secureHashedPassword123",
      connect: { company_id: companyId }
    };

    const a = await request(app).post("/auth/register").set("Authorization", `Bearer ${token}`).send(registrationDataUserss);

  }

  await prisma.user.updateMany({
    data: { company_id: companyId },
  });

});




describe("admin Endpoints", () => {
  it("success getting users; status 200", async () => {


    const response = await request(app)
      .get("/admin/get-users")
      .set("Authorization", `Bearer ${token}`)
      .query({ page: 0 })
      .send();

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.users[0].company).toEqual({ "name": "Test company name" });
    expect(response.body.users.length).toEqual(25);
    expect(response.body.page).toEqual(1);
    expect(response.body.totalPages).toEqual(2);
  });
});










// borrado de lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
