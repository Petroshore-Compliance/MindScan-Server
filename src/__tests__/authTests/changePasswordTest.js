require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let UserId;
let token;


let petroAdminId;
let tokenPetroAdmin;


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
  it("change password; status 200 ", async () => {
    const registrationData = {
      password: "secureHashedPassword123",
      newPassword: "secureHashedPasswor1231",
    };

    const response = await request(app)
      .patch("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("Password changed successfully.");
    expect(response.status).toBe(200);
  });
});


describe("Auth Endpoints", () => {
  it("fail change password; wrong old password; status 401 ", async () => {
    const registrationData = {
      password: "secureHashedPassword123",
      newPassword: "secureHashedPasswor1231",
    };

    const response = await request(app)
      .patch("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 401) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("Old password is incorrect.");
    expect(response.status).toBe(401);
  });
});

describe("Auth Endpoints", () => {
  it("fail change password; invalid new password; status 400 ", async () => {
    const registrationData = {
      password: "secureHashedPasswor1231",
      newPassword: "a",
    };

    const response = await request(app)
      .patch("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body.errors).toEqual(["Invalid new password format."]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail change password; same new password; status 422 ", async () => {
    const registrationData = {
      password: "secureHashedPasswor1231",
      newPassword: "secureHashedPasswor1231",
    };

    const response = await request(app)
      .patch("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 422) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("New password cannot be the same as the old password.");
    expect(response.status).toBe(422);
  });
});


describe("Auth Endpoints", () => {
  it("fail change password; no parameters; status 400 ", async () => {
    const registrationData = {};

    const response = await request(app)
      .patch("/auth/change-password")
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

describe("Auth Endpoints", () => {
  it("fail change password; wrong parameters typeof; status 400 ", async () => {
    const registrationData = {
      password: 2,
      newPassword: 2,
    };

    const response = await request(app)
      .patch("/auth/change-password")
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

describe("Auth Endpoints", () => {
  it("fail change password; user not found; status 404 ", async () => {
    await prisma.user.deleteMany();

    const registrationData = {
      password: "secureHashedPasswor1231",
      newPassword: "secureHashedPasswor123",
    };

    const response = await request(app)
      .patch("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send(registrationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("User not found.");
    expect(response.status).toBe(404);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.petroAdmin.deleteMany();
  await prisma.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
