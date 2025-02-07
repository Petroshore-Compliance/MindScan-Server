require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let userId;
let subscriptionPlanId = 4;
let token;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response = await request(app).post("/auth/register").send(registrationData);

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
});


describe("Auth Endpoints", () => {
  it("success update profile; status 200 ", async () => {
    const updateProfileData = {
      token: token,
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
      token: token, name: "roman",
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
      token: token, name: "roman",
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
      token: token, name: " h!$·,.",
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
        user_id: "userId",
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
      token: token,
      email: "Roman.delasheras@petroshorecompliance.com",

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
  await prisma.user.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
