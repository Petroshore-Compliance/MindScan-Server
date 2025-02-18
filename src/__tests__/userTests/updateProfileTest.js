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

  console.log(company.body)

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
  it("success update profile; status 200 ", async () => {
    const updateProfileData = {
      name: "roman",
      password: "secureHashedPassword123",
    };

    const response = await request(app)
      .patch("/user/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toEqual("User profile updated successfully");
    expect(response.status).toBe(200);

  });
});


describe("Auth Endpoints", () => {
  it("fail update profile;invalid password; status 400 ", async () => {
    const updateProfileData = {
      name: "roman",
      password: "a",
    };

    const response = await request(app)
      .patch("/user/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Invalid password format."]);
  });
});

describe("Auth Endpoints", () => {
  it("fail update profile;invalid email; status 400 ", async () => {
    const updateProfileData = {
      name: "roman",
      email: "a",
    };

    const response = await request(app)
      .patch("/user/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Invalid email format."]);
  });
});

describe("Auth Endpoints", () => {
  it("fail update profile;invalid name; status 400 ", async () => {
    const updateProfileData = {
      name: " h!$·,.",
    };

    const response = await request(app)
      .patch("/user/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Invalid name format."]);
  });
});



describe("Auth Endpoints", () => {
  it("fail update profile;wrong typeof; status 400 ", async () => {
    const updateProfileData = {
      company_id: "companyId",
      name: 33,
      email: 33,
      role: 33,
      password: 33,
    };

    const response = await request(app)
      .patch("/user/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
      "Company ID must be a number.",
      "Name must be a string.",
      "Email must be a string.",
      "Password must be a string.",
      "Invalid role",
    ]);
  });

  describe("Auth Endpoints", () => {
    it("fail update profile;no token; status 401 ", async () => {
      const userData = {
      };

      const response = await request(app).get("/user/me").send(userData);

      if (response.status !== 401) {
        console.log("Response body:", response.body);
      }

      expect(response.body).toEqual({ message: "Acceso denegado" });
      expect(response.status).toBe(401);
    });
  });
});

describe("Auth Endpoints", () => {
  it("fail update profile;no data; status 400 ", async () => {
    const updateProfileData = {

    };

    const response = await request(app)
      .patch("/user/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toEqual("No valid data to update");

    expect(response.status).toBe(400);
  });
});


// borrado de todo lo creado
afterAll(async () => {
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
