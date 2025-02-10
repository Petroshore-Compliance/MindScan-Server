require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let petroAdminId;

let token;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response = await request(app).post("/admin/create").send(registrationData);

  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER.toLowerCase() },
  });

  const registrationData2 = {
    name: "Alice Smith",
    email: "aux@email.com",
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").send(registrationData2);

  petroAdminId = petroAdminData.petroAdmin_id;

  const loginData = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response3 = await request(app).post("/admin/login").send(loginData);

  if (response3.status !== 200) {
    console.log("Response body:", response3.body);
  }

  token = response3.body.token;
});

describe("admin Endpoints", () => {
  it("success get all admin; status 200 ", async () => {
    const petroAdminData = {
    };

    const response = await request(app)
      .get("/admin/get")
      .set("Authorization", `Bearer ${token}`)
      .send(petroAdminData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.petroAdmins.length).toBe(2);

    expect(response.body.message).toEqual("petroAdmins found");
  });
});

describe("admin Endpoints", () => {
  it("success get 1 admin; status 200 ", async () => {
    const petroAdminData = {

      petroAdmin_id: petroAdminId,
    };

    const response = await request(app)
      .get("/admin/get")
      .set("Authorization", `Bearer ${token}`)
      .send(petroAdminData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body.petroAdmin.email).toEqual(EMAIL_TESTER.toLowerCase());
    expect(response.status).toBe(200);

    expect(response.body.message).toEqual("petroAdmin found");
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
