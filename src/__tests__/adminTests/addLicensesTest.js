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

beforeAll(async () => {
  // Register a regular user
  const registrationDataUser = {
    name: "Alice Smith",
    email: userEmail,
    password: "secureHashedPassword123",
  };

  await request(app).post("/auth/register").send(registrationDataUser);

  // Log in the regular user
  const loginDataUser = {
    email: userEmail,
    password: "secureHashedPassword123",
  };

  const loggedUser = await request(app).post("/auth/login").send(loginDataUser);
  console.log(loggedUser.body);
  userId = loggedUser.body.user.user_id;

  // Register an admin user
  const registrationDataAdmin = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").send(registrationDataAdmin);

  // Fetch the admin user from the database
  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER },
  });

  petroAdminId = petroAdminData.petroAdmin_id;

  // Log in the admin user
  const loginDataAdmin = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const responseAdminLogin = await request(app).post("/admin/login").send(loginDataAdmin);

  token = responseAdminLogin.body.token;

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
  console.log(company.body);
  console.log(company.body.user);

  companyId = company.body.company.company_id;
  console.log(companyId);

  const auxcompanyRegistrationData = {
    name: "Test company name",
    email: "asdfasf@asdf.asf",
    user_id: userId,
  };

  await request(app)
    .post("/companies/create-company")
    .set("Authorization", `Bearer ${token}`)
    .send(auxcompanyRegistrationData);
});

describe("admin Endpoints", () => {
  it("success adding licenses; status 200", async () => {
    const licenseAddingData = {
      email: EMAIL_TESTER,
      company_id: companyId,
      licensesNumber: 10,
    };

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({
      message: "10licenses added successfully to a total of 10 licenses.",
    });
    expect(response.status).toBe(200);
  });
});

describe("admin Endpoints", () => {
  it("success adding licenses, again; status 200", async () => {
    const licenseAddingData = {
      email: EMAIL_TESTER,
      company_id: companyId,
      licensesNumber: 346,
    };

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({
      message: "346licenses added successfully to a total of 356 licenses.",
    });
    expect(response.status).toBe(200);
  });
});

describe("admin Endpoints", () => {
  it("fail adding licenses; decimal licensesNumber ;status 400", async () => {
    const licenseAddingData = {
      email: EMAIL_TESTER,
      company_id: companyId,
      licensesNumber: 10.22,
    };

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ message: "Licenses number cannot be negative nor a decimal." });
    expect(response.status).toBe(400);
  });
});
describe("admin Endpoints", () => {
  it("fail adding licenses; decimal licensesNumber ;status 400", async () => {
    const licenseAddingData = {
      email: EMAIL_TESTER,
      company_id: companyId,
      licensesNumber: 0,
    };

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ message: "Licenses number cannot be negative nor a decimal." });
    expect(response.status).toBe(400);
  });
});

describe("admin Endpoints", () => {
  it("fail adding licenses; negative licensesNumber ;status 400", async () => {
    const licenseAddingData = {
      email: EMAIL_TESTER,
      company_id: companyId,
      licensesNumber: -10,
    };

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ message: "Licenses number cannot be negative nor a decimal." });
    expect(response.status).toBe(400);
  });
});

describe("admin Endpoints", () => {
  it("fail adding licenses; unoutharized ;status 401", async () => {
    const licenseAddingData = {
      email: EMAIL_TESTER,
      company_id: companyId,
      licensesNumber: -10,
    };

    const response = await request(app).patch("/admin/add-licenses").send(licenseAddingData);

    if (response.status !== 401) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ message: "Acceso denegado" });
    expect(response.status).toBe(401);
  });
});

describe("admin Endpoints", () => {
  it("fail adding licenses; non-PetroAdmin ;status 403", async () => {
    const licenseAddingData = {
      email: userEmail,
      company_id: companyId,
      licensesNumber: -10,
    };

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 403) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({ errors: "Forbidden" });
    expect(response.status).toBe(403);
  });
});

describe("admin Endpoints", () => {
  it("fail adding licenses;wrong email typeof; status 400", async () => {
    const licenseAddingData = {
      email: "EMAIL_TESTER",
      company_id: companyId,
      licensesNumber: 346,
    };

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body).toEqual({
      errors: ["Invalid email format."],
    });
    expect(response.status).toBe(400);
  });
});

describe("admin Endpoints", () => {
  it("fail adding licenses;wrong company_id and licensesNumber typeof; status 400", async () => {
    const licenseAddingData = {
      email: EMAIL_TESTER,
      company_id: "companyId",
      licensesNumber: "3h46",
    };

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({
      errors: ["Company ID must be a number.", "Number of licenses must be a number."],
    });
    expect(response.status).toBe(400);
  });
});

describe("admin Endpoints", () => {
  it("fail adding licenses;no emailf; status 400", async () => {
    const licenseAddingData = {};

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({
      errors: ["Email cannot be empty."],
    });
    expect(response.status).toBe(400);
  });
});

describe("admin Endpoints", () => {
  it("fail adding licenses;no company_id nor licensesNumber; status 400", async () => {
    const licenseAddingData = {
      email: EMAIL_TESTER,
    };

    const response = await request(app)
      .patch("/admin/add-licenses")
      .set("Authorization", `Bearer ${token}`)
      .send(licenseAddingData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body).toEqual({
      errors: ["Company ID cannot be empty.", "Number of licenses cannot be empty."],
    });
    expect(response.status).toBe(400);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
