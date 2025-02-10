require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let companyId;
let userId;
let companyEmail = "test@test.com";
let companyEmail2 = "test2@test.com";

let subscriptionPlanId = 4;
let token;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/auth/register").send(registrationData);

  const userData = await prisma.user.findUnique({
    where: { email: EMAIL_TESTER.toLowerCase() },
  });
  userId = userData.user_id;

  const loginData = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response3 = await request(app).post("/auth/login").send(loginData);

  if (response3.status !== 200) {
    console.log("Response body:", response3.body);
  }

  token = response3.body.token;
  const companyRegistrationData = {
    name: "Test company name",
    email: companyEmail,
    subscription_plan_id: subscriptionPlanId,
    user_id: userId,
  };

  const companyResponse = await request(app)
    .post("/companies/create-company")
    .set("Authorization", `Bearer ${token}`)
    .send(companyRegistrationData);

  companyId = companyResponse.body.company.company_id;
});

describe("Auth Endpoints", () => {
  it("success get company; status 200 ", async () => {
    const copmanyData = {
      neededRole: "manager",
      company_id: companyId,
    };

    const response = await request(app)
      .get("/companies/get-employees")
      .set("Authorization", `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Employees found");
  });
});

describe("Auth Endpoints", () => {
  it("fail get company; not found; status 404 ", async () => {
    const copmanyData = {
      neededRole: "manager",
      company_id: 1,
    };

    const response = await request(app)
      .get("/companies/get-employees")
      .set("Authorization", `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 404) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Company not found");
  });
});

describe("Auth Endpoints", () => {
  it("fail get company; not company_id; status 400 ", async () => {
    const copmanyData = {
      neededRole: "manager",

    };

    const response = await request(app)
      .get("/companies/get-employees")
      .set("Authorization", `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body.errors).toEqual(["Company ID cannot be empty."]);
    expect(response.status).toBe(400);
  });
});


describe("Auth Endpoints", () => {
  it("fail get company; wrong typeof; status 400 ", async () => {
    const copmanyData = {
      neededRole: "manager",
      company_id: "definitivamente esto es un id",
    };

    const response = await request(app)
      .get("/companies/get-employees")
      .set("Authorization", `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body.errors).toEqual([
      "Company ID must be a number.",
    ]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail get company; missing neededRole; status 400 ", async () => {
    const copmanyData = {
      company_id: "definitivamente esto es un id",
    };

    const response = await request(app)
      .get("/companies/get-employees")
      .set("Authorization", `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body.errors).toEqual("no valid role");
    expect(response.status).toBe(400);
  });
});


describe("Auth Endpoints", () => {
  it("fail get company; not permission; status 403 ", async () => {
    await prisma.user.updateMany({
      data: { role: "employee" },
    });
    const copmanyData = {
      neededRole: "admin",
      company_id: "definitivamente esto es un id",
    };

    const response = await request(app)
      .get("/companies/get-employees")
      .set("Authorization", `Bearer ${token}`)
      .send(copmanyData);

    if (response.status !== 403) {
      console.log("Response body:", response.body);
    }

    expect(response.body.errors).toEqual("user not authorized");
    expect(response.status).toBe(403);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
