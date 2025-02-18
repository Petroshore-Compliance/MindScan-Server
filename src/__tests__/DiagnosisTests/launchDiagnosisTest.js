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

    await prisma.company.updateMany({

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
    console.log("response.body", response.body);
    expect(response.body.message).toEqual("Diagnosis started");
    expect(response.body.page).toEqual(1);
    console.log("response.body", response.body.questions[0]);
    console.log("response.body", response.body.questions[1]);
    console.log("response.body", response.body.questions[2]);
    console.log("response.body", response.body.questions[3]);
    console.log("response.body", response.body.questions[4]);
    console.log("response.body", response.body.questions[5]);
    console.log("response.body", response.body.questions[6]);
    console.log("response.body", response.body.questions[7]);
    console.log("response.body", response.body.questions[8]);
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
    expect(response.body.page).toEqual(2);

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

describe("Auth Endpoints", () => {
  it("success continue diagnosis; status 200 ", async () => {
    const responses = Array.from({ length: 232 }, (_, i) => i + 1);
    await prisma.UserResponses.updateMany({
      data: {
        responses: responses,
      }

    })


    const diagnosisData = {
      language: "en",
    };

    const response = await request(app)
      .post("/diagnoses/launch")
      .set("Authorization", `Bearer ${token}`)
      .send(diagnosisData);

    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }
    expect(response.body.message).toEqual("Diagnosis last page");
    expect(response.body.page).toEqual(30);

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("fail continue diagnosis;; status 409 ", async () => {

    const responses = Array.from({ length: 240 }, (_, i) => i + 1);
    await prisma.UserResponses.updateMany({
      data: {
        responses: responses,
      }

    })


    const diagnosisData = {
      language: "en",
    };

    const response = await request(app)
      .post("/diagnoses/launch")
      .set("Authorization", `Bearer ${token}`)
      .send(diagnosisData);

    if (response.status !== 409) {
      console.log("Response bodddddy:", response.body);
    }
    expect(response.body.message).toEqual("Diagnosis already completed");
    expect(response.body.page).toEqual(31);

    expect(response.status).toBe(409);
  });
});



// borrado de lo creado
afterAll(async () => {
  await prisma.result.deleteMany();

  await prisma.userResponses.deleteMany();
  await prisma.user.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
