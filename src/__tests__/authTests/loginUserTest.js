require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;



let petroAdminId;

let tokenPetroAdmin;

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/admin/create").send(registrationData);

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

  const loginData = {
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  const response3 = await request(app).post("/admin/login").send(loginData);

  if (response3.status !== 200) {
    console.log("Response body:", response3.body);
  }
  tokenPetroAdmin = response3.body.token;


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
});


describe("Auth Endpoints", () => {
  it("login user; status 200", async () => {
    const userData = await prisma.user.findUnique({
      where: { email: EMAIL_TESTER.toLowerCase() },
    });

    const loginData = {
      email: EMAIL_TESTER,
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("User logged in successfully");
    console.log(response.body);
    let token = response.body.token;
  });
});

describe("Auth Endpoints", () => {
  it("fail login user; not email; status 400", async () => {
    const loginData = {
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Email cannot be empty."]);

    token = response.body.token;
  });
});

describe("Auth Endpoints", () => {
  it("fail login user; not password; status 400", async () => {
    const loginData = {
      email: EMAIL_TESTER,
    };

    const response = await request(app).post("/auth/login").send(loginData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Password cannot be empty."]);

    token = response.body.token;
  });
});

describe("Auth Endpoints", () => {
  it("fail login user; wrong email; status 404", async () => {
    const verificationData = {
      email: "wrongEmail@petroshorecompliance.com",
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/auth/login").send(verificationData);

    if (response.status !== 404) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Wrong Email or Password" });
  });
});

describe("Auth Endpoints", () => {
  it("fail login user; wrong password; status 401", async () => {
    const verificationData = {
      email: EMAIL_TESTER,
      password: "secureHashedPasswosssrd123",
    };

    const response = await request(app).post("/auth/login").send(verificationData);

    if (response.status !== 401) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Wrong Email or Password" });
  });
});

describe("Auth Endpoints", () => {
  it("fail login user; invalid password; status 400", async () => {
    const verificationData = {
      email: EMAIL_TESTER,
      password: "asdfasdfasdf",
    };

    const response = await request(app).post("/auth/login").send(verificationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.",
    ]);
  });
});

describe("Auth Endpoints", () => {
  it("fail login user; invalid email; status 400", async () => {
    const verificationData = {
      email: "aaaaaasdfsadfasdfa",
      password: "secureHashedPassword123",
    };

    const response = await request(app).post("/auth/login").send(verificationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Invalid email format."]);
  });
});

describe("Auth Endpoints", () => {
  it("login user; wrong typeofs ;status 400", async () => {
    const verificationData = {
      email: 888,
      password: 888,
    };

    const response = await request(app).post("/auth/login").send(verificationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Email must be a string.", "Password must be a string."]);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
