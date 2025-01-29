require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let UserId;
let token;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response = await request(app).post("/auth/register").send(registrationData);

  const userData = await prisma.user.findUnique({
    where: { email: EMAIL_TESTER },
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
      user_id: UserId,
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
      user_id: UserId,
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
      user_id: UserId,
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
      user_id: UserId,
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
  it("fail change password; user not found; status 404 ", async () => {
    const registrationData = {
      user_id: 1,
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
      "User id cannot be empty.",
    ]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail change password; wrong parameters typeof; status 400 ", async () => {
    const registrationData = {
      user_id: "h",
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
      "User id must be a number.",
    ]);
    expect(response.status).toBe(400);
  });
});

// borrado de todo lo creado
afterAll(async () => {
  if (EMAIL_TESTER) {
    try {
      // Comprobar la existencia del usuario antes de intentar borrarlo
      const user = await prisma.user.findUnique({ where: { email: EMAIL_TESTER } });

      if (user) {
        await prisma.user.delete({ where: { email: EMAIL_TESTER } });
      }
    } catch (error) {
      console.error("Failed to delete test user:", error);
    }
  }
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
