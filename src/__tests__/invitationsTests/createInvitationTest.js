require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let companyId = 0;
let userId;
let auxUserId;
let companyEmail = "test@test.com";

let subscriptionPlanId = 4;
let token;

/* beforeAll:
1- Registrar usuario que va a ser el admin de la compañía
2- Registrar usuario que va a ser el usuario de la compañía
3- Crear una compañía
*/
beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/auth/register").send(registrationData);

  const registrationDataAux = {
    name: "Alice Smith",
    email: "aux@email.com",
    password: "secureHashedPassword123",
  };

  await request(app).post("/auth/register").send(registrationDataAux);

  const auxuserData = await prisma.user.findUnique({
    where: { email: "aux@email.com" },
  });

  auxUserId = auxuserData.user_id;

  const userData = await prisma.user.findUnique({
    where: { email: EMAIL_TESTER },
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

  const companyData = {
    name: "Test company name",
    email: companyEmail,
    subscription_plan_id: subscriptionPlanId,
    user_id: userId,
  };

  const companyResponse = await request(app)
    .post("/companies/create-company")
    .set("Authorization", `Bearer ${token}`)
    .send(companyData);

  console.log("usunu", companyResponse.body);

  const companyInviter = await prisma.company.findUnique({
    where: { company_id: companyResponse._body.company.company_id },
    include: {
      users: true,
    },
  });

  companyId = companyInviter.company_id;
});

describe("Auth Endpoints", () => {
  it("success create invitation; status 201 ", async () => {
    const companyData = {
      company_id: companyId,
      email: "roman.delasheras@petroshorecompasdliance.com",
    };

    const response = await request(app)
      .post("/invitations/create-invitation")
      .set("Authorization", `Bearer ${token}`)
      .send(companyData);

    if (response.status !== 201) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual("Invitation created successfully");
    expect(response.status).toBe(201);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation;company not found; status 404 ", async () => {
    const companyData = {
      company_id: 1,
      email: "roman.delasheras@lol.com",
    };

    const response = await request(app)
      .post("/invitations/create-invitation")
      .set("Authorization", `Bearer ${token}`)
      .send(companyData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toBe("Company not found");
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation; not company id; status 404 ", async () => {
    const companyData = {
      email: "roman.delasheras@lol.com",
    };

    const response = await request(app)
      .post("/invitations/create-invitation")
      .set("Authorization", `Bearer ${token}`)
      .send(companyData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Company ID cannot be empty."]);
    expect(response.status).toBe(400);
  });
});



describe("Auth Endpoints", () => {
  it("fail create invitation; wrong typeof; status 404 ", async () => {
    const companyData = {
      company_id: "definetly not a number",
      email: 234,
    };

    const response = await request(app)
      .post("/invitations/create-invitation")
      .set("Authorization", `Bearer ${token}`)
      .send(companyData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual([
      "Company ID must be a number.",
      "Email must be a string.",
    ]);
    expect(response.status).toBe(400);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
