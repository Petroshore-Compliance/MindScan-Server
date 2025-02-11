require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let companyId;
let userId;
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

  const companyInviter = await prisma.company.findUnique({
    where: { company_id: companyResponse._body.company.company_id },
    include: {
      users: true,
    },
  });

  companyId = companyInviter.company_id;
});
describe("Auth Endpoints", () => {
  it("fail start diagnosis;not enough licenses; status 402 ", async () => {
    const diagnosisData = {
      language: "es",
    };

    const response = await request(app)
      .post("/diagnoses/launch")
      .set("Authorization", `Bearer ${token}`)
      .send(diagnosisData);

    if (response.status !== 402) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ "message": "Not enough licenses" });
    expect(response.status).toBe(402);
  });
});

describe("Auth Endpoints", () => {
  it("success created diagnosis(spending licenses); status 201 ", async () => {

    await prisma.company.update({
      where: {
        company_id: companyId,
      },
      data: {
        licenses: 1,
      },
    });

    const diagnosisData = {
      language: "en",
    };

    const response = await request(app)
      .post("/diagnoses/launch")
      .set("Authorization", `Bearer ${token}`)
      .send(diagnosisData);

    if (response.status !== 201) {
      console.log("Response bodddddy:", response.body);
    }
    expect(response.body.message).toEqual("Diagnosis started");
    expect(response.status).toBe(201);
  });
});


describe("Auth Endpoints", () => {
  it("success continue diagnosis; status 206 ", async () => {

    await prisma.UserResponses.updateMany({
      data: {
        responses: [1, 2, 3, 4, 5, 6, 7, 8],
      }

    })


    const diagnosisData = {
      language: "en",
    };

    const response = await request(app)
      .post("/diagnoses/launch")
      .set("Authorization", `Bearer ${token}`)
      .send(diagnosisData);

    if (response.status !== 206) {
      console.log("Response bodddddy:", response.body);
    }
    expect(response.body.message).toEqual("Diagnosis continued");
    expect(response.status).toBe(206);
  });
});

describe("Auth Endpoints", () => {
  it("fail start diagnosis;not valid language; status 400 ", async () => {
    const diagnosisData = {
      language: "esto no es un idioma valido",
    };

    const response = await request(app)
      .post("/diagnoses/launch")
      .set("Authorization", `Bearer ${token}`)
      .send(diagnosisData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ "message": "language must be es, en or pt" });
    expect(response.status).toBe(400);
  });
});


describe("Auth Endpoints", () => {
  it("fail start diagnosis;not auth token; status 401 ", async () => {
    const diagnosisData = {
      language: "esto no es un idioma valido",
    };

    const response = await request(app)
      .post("/diagnoses/launch")
      .send(diagnosisData);

    if (response.status !== 401) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({ "message": "Acceso denegado" });
    expect(response.status).toBe(401);
  });
});



// borrado de lo creado
afterAll(async () => {
  await prisma.userResponses.deleteMany();
  await prisma.user.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
