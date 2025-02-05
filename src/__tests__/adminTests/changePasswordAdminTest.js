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

  await request(app).post("/admin/create").send(registrationData);

  const petroAdminData = await prisma.petroAdmin.findUnique({
    where: { email: EMAIL_TESTER },
  });

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

  console.log(response3);
});

describe("admin Endpoints", () => {
  it("change password; status 200 ", async () => {
    const registrationData = {

      password: "secureHashedPassword123",
      newPassword: "secureHashedPasswor1231",
    };

    const response = await request(app)
      .patch("/admin/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("Password changed successfully.");
    expect(response.status).toBe(200);
  });
});

describe("admin Endpoints", () => {
  it("fail change password; wrong old password; status 401 ", async () => {
    const registrationData = {

      password: "secureHashedPassword123",
      newPassword: "secureHashedPasswor1231",
    };

    const response = await request(app)
      .patch("/admin/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 401) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("Old password is incorrect.");
    expect(response.status).toBe(401);
  });
});

describe("admin Endpoints", () => {
  it("fail change password; invalid new password; status 400 ", async () => {
    const registrationData = {

      password: "secureHashedPasswor1231",
      newPassword: "a",
    };

    const response = await request(app)
      .patch("/admin/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body.errors).toEqual(["Invalid new password format."]);
    expect(response.status).toBe(400);
  });
});

describe("admin Endpoints", () => {
  it("fail change password; same new password; status 422 ", async () => {
    const registrationData = {

      password: "secureHashedPasswor1231",
      newPassword: "secureHashedPasswor1231",
    };

    const response = await request(app)
      .patch("/admin/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 422) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("New password cannot be the same as the old password.");
    expect(response.status).toBe(422);
  });
});


describe("admin Endpoints", () => {
  it("fail change password; no parameters; status 400 ", async () => {
    const registrationData = {
    };

    const response = await request(app)
      .patch("/admin/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body.errors).toEqual([
      "Password cannot be empty.",
      "New password cannot be empty.",
    ]);
    expect(response.status).toBe(400);
  });
});

describe("admin Endpoints", () => {
  it("fail change password; wrong parameters typeof; status 400 ", async () => {
    const registrationData = {

      password: 2,
      newPassword: 2,
    };

    const response = await request(app)
      .patch("/admin/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body.errors).toEqual([
      "Password must be a string.",
      "New password must be a string.",
    ]);
    expect(response.status).toBe(400);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.petroAdmin.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
