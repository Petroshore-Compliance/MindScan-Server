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
    where: { email: EMAIL_TESTER },
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
      user_id: userId,
      name: "roman",
      password: "secureHashedPassword123",
    };

    const response = await request(app)
      .patch("/users/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("User profile updated successfully");
  });
});

describe("Auth Endpoints", () => {
  it("fail update profile; no userId; status 400 ", async () => {
    const updateProfileData = {
      name: "roman",
      password: "secureHashedPassword123",
    };

    const response = await request(app)
      .patch("/users/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["User ID cannot be empty."]);
  });
});

describe("Auth Endpoints", () => {
  it("fail update profile;invalid password; status 400 ", async () => {
    const updateProfileData = {
      user_id: userId,
      name: "roman",
      password: "a",
    };

    const response = await request(app)
      .patch("/users/update-profile")
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
      user_id: userId,
      name: "roman",
      email: "a",
    };

    const response = await request(app)
      .patch("/users/update-profile")
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
      user_id: userId,
      name: " h!$·,.",
    };

    const response = await request(app)
      .patch("/users/update-profile")
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
      user_id: "userId",
      company_id: "companyId",
      name: 33,
      email: 33,
      role: 33,
      password: 33,
    };

    const response = await request(app)
      .patch("/users/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
      "Company ID must be a number.",
      "User ID must be a number.",
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

      const response = await request(app).get("/users/me").send(userData);

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
      user_id: userId,
    };

    const response = await request(app)
      .patch("/users/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send(updateProfileData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toEqual("User profile cannot be updated with only user_id");

    expect(response.status).toBe(400);
  });
});


// borrado de todo lo creado
afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
