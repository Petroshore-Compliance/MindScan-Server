require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let userId;
let companyEmail = "test@test.com";
let companyEmail2 = "test2@test.com";
let tokenPetroAdmin;


let petroAdminId;


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
  it("success create company; status 201 ", async () => {
    const companyRegistrationData = {
      name: "Test company name",
      email: companyEmail + "   ",
      user_id: UserId,

    };

    const response = await request(app)
      .post("/companies/create-company")
      .set("Authorization", `Bearer ${token}`)
      .send(companyRegistrationData);

    if (response.status !== 201) {
      console.log("Response body:", response.body);
    }
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Company created successfully");
  });
});
describe("Auth Endpoints", () => {
  it("fail create company; missing name; status 400 ", async () => {
    const registrationData = {
      email: companyEmail,
      user_id: UserId,

    };

    const response = await request(app)
      .post("/companies/create-company")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Name cannot be empty."]);
  });
});



describe("Auth Endpoints", () => {
  it("fail create company; email already in use; status 409", async () => {
    const registrationData = {
      name: "Test company name",
      email: companyEmail,
      user_id: UserId,
    };

    const response = await request(app)
      .post("/companies/create-company")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 409) {
      console.log("Response body:", response.body);
    }
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email already in use");
  });
});

describe("Auth Endpoints", () => {
  it("fail create company; wrong typeof; status 400", async () => {
    const registrationData = {
      name: 23,
      email: 23,
      user_id: "23",

    };

    const response = await request(app)
      .post("/companies/create-company")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
      "Email must be a string.",
      "Name must be a string.",
    ]);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
