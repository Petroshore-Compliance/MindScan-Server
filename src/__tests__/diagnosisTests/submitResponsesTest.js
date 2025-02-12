require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;

let companyId;
let userId;
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


  await prisma.company.update({
    where: {
      company_id: companyId,
    },
    data: {
      licenses: 1,
    },
  });

  const diagnosisData = {
    language: "en",
  };

  await request(app)
    .post("/diagnoses/launch")
    .set("Authorization", `Bearer ${token}`)
    .send(diagnosisData);
});


describe("Auth Endpoints", () => {
  it("success submitting responses; status 200 ", async () => {

    const responsesData = {
      responses: [2, 3, 4, 1, 3, 0, 2, 3]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");
    expect(response.body.updatedDiagnosis.responses).toEqual([2, 3, 4, 1, 3, 0, 2, 3]);
    expect(response.body.updatedDiagnosis.responses_value).toEqual([2, 3, 0, 1, 1, 0, 2, 3]);

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 2; status 200 ", async () => {

    const responsesData = {
      responses: [2, 3, 4, 1, 3, 0, 2, 3]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");
    expect(response.body.updatedDiagnosis.responses).toEqual([2, 3, 4, 1, 3, 0, 2, 3, 2, 3, 4, 1, 3, 0, 2, 3]);
    expect(response.body.updatedDiagnosis.responses_value).toEqual([2, 3, 0, 1, 1, 0, 2, 3, 2, 1, 4, 3, 3, 0, 2, 3]);

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("fail submitting responses; wrong responses length; status 400 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 400) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses must be an array of 8 integers between 0 and 4");

    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail submitting responses; wrong responses number; status 400 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 999]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 400) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses must be an array of 8 integers between 0 and 4");

    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail submitting responses; no responses ; status 400 ", async () => {

    const responsesData = {
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 400) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses must be an array of 8 integers between 0 and 4");

    expect(response.status).toBe(400);
  });
});

describe("Auth Endpoints", () => {
  it("fail submitting responses; wrong responses length; status 400 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 400) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses must be an array of 8 integers between 0 and 4");

    expect(response.status).toBe(400);
  });
});


describe("Auth Endpoints", () => {
  it("fail submitting responses; no token; status 401 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .send(responsesData);


    if (response.status !== 401) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Acceso denegado");

    expect(response.status).toBe(401);
  });
});



describe("Auth Endpoints", () => {
  it("success submitting responses 3; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");
    expect(response.body.updatedDiagnosis.responses).toEqual([2, 3, 4, 1, 3, 0, 2, 3, 2, 3, 4, 1, 3, 0, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4]);
    expect(response.body.updatedDiagnosis.responses_value).toEqual([2, 3, 0, 1, 1, 0, 2, 3, 2, 1, 4, 3, 3, 0, 2, 3, 4, 0, 4, 0, 4, 0, 0, 0]);

    expect(response.status).toBe(200);
  });
});


describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Responses submitted");

    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses 4-40; status 200 ", async () => {

    const responsesData = {
      responses: [4, 4, 4, 4, 4, 4, 4, 4]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body).toEqual({ "message": "Diangosis already submitted" });

    expect(response.status).toBe(200);
  });
});


// borrado de lo creado
afterAll(async () => {
  await prisma.userResponses.deleteMany();
  await prisma.user.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
