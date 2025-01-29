require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let companyId = 0;
let userId;
let auxUserId;
let companyEmail = "test@test.com";
let subscriptionPlanId = 4;
let token;

/* beforeAll:
1- Registrar usuario que va a ser el admin de la compañía
2- Registrar usuario que va a ser el usuario de la compañía
3- Crear una compañía
*/

beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
  };

  await request(app).post("/auth/register").send(registrationData);

  const registrationDataAux = {
    name: "Alice Smith",
    email: "aux@email.com",
    password: "secureHashedPassword123",
  };

  await request(app).post("/auth/register").send(registrationDataAux);

  const auxuserData = await prisma.user.findUnique({
    where: { email: "aux@email.com" },
  });

  auxUserId = auxuserData.user_id;

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

  const companyData = {
    name: "Test company name",
    email: companyEmail,
    subscription_plan_id: subscriptionPlanId,
    user_id: userId,
  };

  const companyResponse = await request(app)
    .post("/companies/create-company")
    .set("Authorization", `Bearer ${token}`)
    .send(companyData);

  const companyInviter = await prisma.company.findUnique({
    where: { company_id: companyResponse._body.company.company_id },
    include: {
      users: true,
    },
  });

  companyId = companyInviter.company_id;
});

describe("Auth Endpoints", () => {
  it("fail create invitation;invited is the company admin; status 409 ", async () => {
    const invitationData = {
      host: EMAIL_TESTER,
      guest: EMAIL_TESTER,
      neededRole: "manager",

      role: "manager",
      company_id: companyId,
      companyName: "uwuntu",
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
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
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: "exito@invited.com",
      role: "definitivamente esto no es un rol",
      company_id: companyId,
      companyName: "uwuntu",
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
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
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: 34,
      role: 22,
      company_id: "companyId",
      companyName: 2,
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual([
      "Guest email must be a string.",
      "Role must be a string.",
      "Company ID must be a number.",
    ]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("success create invitation; status 200 ", async () => {
    const invitationData = {
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: "exito@invited.com",
      role: "employee",
      company_id: companyId,
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 201) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toBe("Invitation created successfully");
    expect(response.status).toBe(201);

    await request(app).post("/auth/registerUser").send(invitationData);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation;already pending invitation; status 400", async () => {
    const invitationData = {
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: "exito@invited.com",
      role: "employee",
      company_id: companyId,
      companyName: "uwuntu",
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
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
      company_id: companyId,
      role: "employee",
    };
    console.log("bbbbbbdfsbsdfbvsdfbsdfbsefbsd", registerUserData);
    const invitationData = {
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: "exito@invited.com",
      role: "employee",
      company_id: companyId,
    };

    await request(app).post("/auth/register").send(registerUserData);

    await prisma.companyInvitation.deleteMany();

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
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
    await prisma.user.update({
      where: {
        email: "exito@invited.com",
      },
      data: {
        company_id: null,
      },
    });

    const invitationData = {
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: "exito@invited.com",
      role: "employee",
      company_id: companyId,
      companyName: "uwuntu",
    };
    await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
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
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: "exito@invited.com",
      role: "employee",
      company_id: companyId,
      companyName: "uwuntu",
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
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
      host: EMAIL_TESTER,
      neededRole: "manager",
      role: "employee",
      company_id: companyId,
      companyName: "uwuntu",
    };

    const response = await request(app).post("/companies/invite").send(invitationData);

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
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: undefined,
      role: "employee",
      company_id: companyId,
      companyName: "uwuntu",
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Guest email cannot be empty."]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation; missing role;status 400 ", async () => {
    const invitationData = {
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: "exito@invited.com",
      role: undefined,
      company_id: companyId,
      companyName: "uwuntu",
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Role cannot be empty."]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation; missing all data;status 400 ", async () => {
    const invitationData = {
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: "exito@invited.com",
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Role cannot be empty.", "Company ID cannot be empty."]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation; missing company_id;status 400 ", async () => {
    const invitationData = {
      host: EMAIL_TESTER,
      neededRole: "manager",
      guest: "exito@invited.com",
      role: "employee",
      companyName: "uwuntu",
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toEqual(["Company ID cannot be empty."]);
    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation; missing host;status 400 ", async () => {
    const invitationData = {
      neededRole: "manager",
      guest: "exito@invited.com",
      role: "employee",
      company_id: companyId,
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toBe("no valid host email");
    expect(response.status).toBe(400);

    await request(app).post("/auth/registerUser").send(invitationData);
  });
});

describe("Auth Endpoints", () => {
  it("fail create invitation; missing neededRole; status 400", async () => {
    const invitationData = {
      host: EMAIL_TESTER,
      guest: "exito@invited.com",
      role: "employee",
      company_id: companyId,
    };

    const response = await request(app)
      .post("/companies/invite")
      .set("Authorization", `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log("Response body:", response.body);
    }
    expect(response.body.errors).toBe("no valid role");
    expect(response.status).toBe(400);

    await request(app).post("/auth/registerUser").send(invitationData);
  });
});

// borrado de lo creado
afterAll(async () => {
  await prisma.user.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
