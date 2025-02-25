require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

jest.setTimeout(30000);

let petroAdminId;
const companyEmail = "compania@company.pou";
let companyId;
const userEmail = "user@user.pou";
let userId;
let tokenAdmin;
let token;
let auxUserId;
const emailChangeCompany = "romanraldhc1@gmail.com";


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
  it("fail create invitation;not enough licenses; status 402 ", async () => {
    const invitationData = {

      guest: EMAIL_TESTER,


    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 402) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("Not enough licenses");
    expect(response.status).toBe(402);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation;invited is the company admin; status 409 ", async () => {

    await prisma.company.updateMany({
      data: {
        licenses: 1000,
      },
    });

    const invitationData = {

      guest: userEmail,



    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 409) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("This user is already part of this company");
    expect(response.status).toBe(409);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation;role not exists ;status 200 ", async () => {
    const invitationData = {


      guest: "exito@invited.com",

    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "managekljñsdljkfsdjlr" })
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Role not recognised"]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation;wrong typeof; status 200 ", async () => {
    const invitationData = {

      guest: 34,

    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual([
      "Guest email must be a string.",
    ]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("success create invitation; status 200 ", async () => {
    const invitationData = {

      guest: "exito@invited.com",

    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 201) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("Invitation created successfully");
    expect(response.status).toBe(201);

    await request(app).post("/auth/registerUser").query({ role: "manager" })
      .send(invitationData);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation;already pending invitation; status 400", async () => {
    const invitationData = {


      guest: "exito@invited.com",

    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("This Guest email already has a pending invitation");
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation ; already a member ; status 409", async () => {
    const registerUserData = {
      email: "exito@invited.com",
      password: "secureHashedPassword123",
      name: "exito",
      surname: "exito",
      role: "employee",
    };
    const invitationData = {


      guest: userEmail,

    };

    await request(app).post("/auth/register").set("Authorization", `Bearer ${tokenAdmin}`).query({ role: "manager" })
      .send(registerUserData);

    await prisma.companyInvitation.deleteMany();

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 409) {
      console.log("Response body:", response.body);
    }

    expect(response.body.message).toBe("This user is already part of this company");
    expect(response.status).toBe(409);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation ; invited in last hour ; status 429", async () => {

    //simula sacar el usuario de la empresa
    const editsNumber = await prisma.user.update({
      where: {
        email: "exito@invited.com",
      },
      data: {
        company_id: null,
      },
    });

    console.log("editsNumber", editsNumber);

    const invitationData = {


      guest: "exito@invited.com",

    };
    await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    await prisma.companyInvitation.updateMany({
      where: {
        email: "exito@invited.com",
      },
      data: {
        status: "cancelled",
      },
    });

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 429) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("Guest email invited within hour");
    expect(response.status).toBe(429);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation ; admin another company ; status 403", async () => {
    //simula que el usuario es admin en otra empresa
    await prisma.user.update({
      where: {
        email: "exito@invited.com",
      },
      data: {
        company_id: null,
        role: "admin",
      },
    });

    const invitationData = {


      guest: "exito@invited.com",

    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 403) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe(
      "This user is the administrator of a company, you cant invite him to another company"
    );
    expect(response.status).toBe(403);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation; not logged in ;status 401 ", async () => {
    const invitationData = {



    };

    const response = await request(app).post("/companies/invite").query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 401) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("Acceso denegado");
    expect(response.status).toBe(401);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation; missing Guest email;status 400 ", async () => {
    const invitationData = {

      guest: undefined,
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Guest email cannot be empty."]);
    expect(response.status).toBe(400);
  });
});



describe("Auth Endpoints", () => {
  it("fail create invitation; missing all data;status 400 ", async () => {
    const invitationData = {


    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .query({ role: "manager" })
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Guest email cannot be empty.",]);
    expect(response.status).toBe(400);
  });
});





describe("Auth Endpoints", () => {
  it("fail create invitation; missing neededRole; status 400", async () => {
    const invitationData = {

      guest: "exito@invited.com",

    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Role is required"]);
    expect(response.status).toBe(400);

    await request(app).post("/auth/registerUser").query({ role: "manager" })
      .send(invitationData);
  });
});



// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.petroAdmin.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
