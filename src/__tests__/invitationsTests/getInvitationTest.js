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
let invitationId;

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
  it("successfully creates 20 invitations; status 201", async () => {
    const invitations = Array.from({ length: 20 }, (_, i) => ({
      company_id: companyId,
      guest: `testuser${i}@example.com`, // Unique guest emails
    }));

    const responses = await Promise.all(
      invitations.map((companyData) =>
        request(app)
          .post("/invitations/create-invitation")
          .set("Authorization", `Bearer ${token}`)
          .send(companyData)
      )
    );

    // Check if all responses were successful
    responses.forEach((response, index) => {
      if (response.status !== 201) {
        console.log(`Response ${index} body:`, response.body);
      }
      expect(response.status).toBe(201);
      expect(response.body).toEqual("Invitation created successfully");
    });
  });
});


describe("Auth Endpoints", () => {
  it("success get invitation; status 200 ", async () => {
    const companyData = {
    };

    const response = await request(app)
      .get("/invitations/get-invitation")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(companyData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toEqual("Invitation found");
    expect(response.body.invitation.length).toEqual(20);
    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success get invitation; status 200 ", async () => {

    const infoInvitation = await prisma.companyInvitation.findFirst({

    });

    invitationId = infoInvitation.invitation_id;

    const companyData = {
      invitation_id: invitationId,
    };

    const response = await request(app)
      .get("/invitations/get-invitation")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(companyData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toEqual("Invitation found");
    expect(response.status).toBe(200);
  });
});


// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.petroAdmin.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
