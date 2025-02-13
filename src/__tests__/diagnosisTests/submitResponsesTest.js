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
  it("success submitting responses 1-39 (all 0); status 200 ", async () => {
    await prisma.userResponses.updateMany({

      data: {
        responses: [],
        responses_value: []
      }
    });

    const responsesData = {
      responses: [0, 0, 0, 0, 0, 0, 0, 0]
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

    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);

    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);

  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses finish all 0; status 200 ", async () => {




    const responsesData = {
      responses: [0, 0, 0, 0, 0, 0, 0, 0]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Diangosis finished, results calculated");
    expect(response.body.diagnosis.anxiety).toEqual(16);
    expect(response.body.diagnosis.cordiality).toEqual(8);
    expect(response.body.diagnosis.fantasy).toEqual(20);
    expect(response.body.diagnosis.trust).toEqual(12);
    expect(response.body.diagnosis.competence).toEqual(12);

    expect(response.body.diagnosis.hostility).toEqual(12);
    expect(response.body.diagnosis.gregariousness).toEqual(16);
    expect(response.body.diagnosis.aesthetic_appreciation).toEqual(12);
    expect(response.body.diagnosis.frankness).toEqual(20);
    expect(response.body.diagnosis.orderliness).toEqual(20);

    expect(response.body.diagnosis.depression).toEqual(8);
    expect(response.body.diagnosis.assertiveness).toEqual(16);
    expect(response.body.diagnosis.feelings).toEqual(12);
    expect(response.body.diagnosis.altruism).toEqual(12);
    expect(response.body.diagnosis.sense_of_duty).toEqual(8);

    expect(response.body.diagnosis.social_anxiety).toEqual(12);
    expect(response.body.diagnosis.activity).toEqual(12);
    expect(response.body.diagnosis.actions).toEqual(20);
    expect(response.body.diagnosis.conciliatory_attitude).toEqual(20);
    expect(response.body.diagnosis.need_for_achievement).toEqual(12);

    expect(response.body.diagnosis.impulsivity).toEqual(16);
    expect(response.body.diagnosis.excitement_seeking).toEqual(8);
    expect(response.body.diagnosis.ideas).toEqual(12);
    expect(response.body.diagnosis.modesty).toEqual(16);
    expect(response.body.diagnosis.self_discipline).toEqual(16);

    expect(response.body.diagnosis.vulnerability).toEqual(20);
    expect(response.body.diagnosis.positive_emotions).toEqual(16);
    expect(response.body.diagnosis.values).toEqual(20);
    expect(response.body.diagnosis.sensitivity_to_others).toEqual(8);
    expect(response.body.diagnosis.deliberation).toEqual(12);

    expect(response.body.diagnosis.neuroticism_x_emotional_stability).toEqual(84);
    expect(response.body.diagnosis.extraversion).toEqual(76);
    expect(response.body.diagnosis.openness_to_experience).toEqual(96);
    expect(response.body.diagnosis.agreeableness_or_amiability).toEqual(88);
    expect(response.body.diagnosis.perseverance_or_responsibility).toEqual(80);

    expect(response.status).toBe(200);
  });
});


describe("Auth Endpoints", () => {
  it("success submitting responses 1-39 (all 4); status 200 ", async () => {
    await prisma.userResponses.updateMany({

      data: {
        responses: [],
        responses_value: []
      }
    });

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

    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);

    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);

  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses finish all 4; status 200 ", async () => {




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

    expect(response.body.message).toEqual("Diangosis finished, results calculated");
    expect(response.body.diagnosis.anxiety).toEqual(16);
    expect(response.body.diagnosis.cordiality).toEqual(24);
    expect(response.body.diagnosis.fantasy).toEqual(12);
    expect(response.body.diagnosis.trust).toEqual(20);
    expect(response.body.diagnosis.competence).toEqual(20);

    expect(response.body.diagnosis.hostility).toEqual(20);
    expect(response.body.diagnosis.gregariousness).toEqual(16);
    expect(response.body.diagnosis.aesthetic_appreciation).toEqual(20);
    expect(response.body.diagnosis.frankness).toEqual(12);
    expect(response.body.diagnosis.orderliness).toEqual(12);

    expect(response.body.diagnosis.depression).toEqual(24);
    expect(response.body.diagnosis.assertiveness).toEqual(16);
    expect(response.body.diagnosis.feelings).toEqual(20);
    expect(response.body.diagnosis.altruism).toEqual(20);
    expect(response.body.diagnosis.sense_of_duty).toEqual(24);

    expect(response.body.diagnosis.social_anxiety).toEqual(20);
    expect(response.body.diagnosis.activity).toEqual(20);
    expect(response.body.diagnosis.actions).toEqual(12);
    expect(response.body.diagnosis.conciliatory_attitude).toEqual(12);
    expect(response.body.diagnosis.need_for_achievement).toEqual(20);

    expect(response.body.diagnosis.impulsivity).toEqual(16);
    expect(response.body.diagnosis.excitement_seeking).toEqual(24);
    expect(response.body.diagnosis.ideas).toEqual(20);
    expect(response.body.diagnosis.modesty).toEqual(16);
    expect(response.body.diagnosis.self_discipline).toEqual(16);

    expect(response.body.diagnosis.vulnerability).toEqual(12);
    expect(response.body.diagnosis.positive_emotions).toEqual(16);
    expect(response.body.diagnosis.values).toEqual(12);
    expect(response.body.diagnosis.sensitivity_to_others).toEqual(24);
    expect(response.body.diagnosis.deliberation).toEqual(20);

    expect(response.body.diagnosis.neuroticism_x_emotional_stability).toEqual(108);
    expect(response.body.diagnosis.extraversion).toEqual(116);
    expect(response.body.diagnosis.openness_to_experience).toEqual(96);
    expect(response.body.diagnosis.agreeableness_or_amiability).toEqual(104);
    expect(response.body.diagnosis.perseverance_or_responsibility).toEqual(112);
    expect(response.status).toBe(200);
  });
});


describe("Auth Endpoints", () => {
  it("success submitting responses 1-39 (all 0,4,2,3,0,2,1,3); status 200 ", async () => {
    await prisma.userResponses.updateMany({

      data: {
        responses: [],
        responses_value: []
      }
    });

    const responsesData = {
      responses: [0, 4, 2, 3, 0, 2, 1, 3]
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

    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);

    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);
    await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);

  });
});

describe("Auth Endpoints", () => {
  it("success submitting responses finish all 0,4,2,3,0,2,1,3; status 200 ", async () => {




    const responsesData = {
      responses: [0, 4, 2, 3, 0, 2, 1, 3]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 200) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body.message).toEqual("Diangosis finished, results calculated");
    expect(response.body.diagnosis.anxiety).toEqual(25);
    expect(response.body.diagnosis.cordiality).toEqual(9);
    expect(response.body.diagnosis.fantasy).toEqual(9);
    expect(response.body.diagnosis.trust).toEqual(23);
    expect(response.body.diagnosis.competence).toEqual(9);

    expect(response.body.diagnosis.hostility).toEqual(9);
    expect(response.body.diagnosis.gregariousness).toEqual(25);
    expect(response.body.diagnosis.aesthetic_appreciation).toEqual(23);
    expect(response.body.diagnosis.frankness).toEqual(9);
    expect(response.body.diagnosis.orderliness).toEqual(23);

    expect(response.body.diagnosis.depression).toEqual(19);
    expect(response.body.diagnosis.assertiveness).toEqual(7);
    expect(response.body.diagnosis.feelings).toEqual(9);
    expect(response.body.diagnosis.altruism).toEqual(23);
    expect(response.body.diagnosis.sense_of_duty).toEqual(9);

    expect(response.body.diagnosis.social_anxiety).toEqual(9);
    expect(response.body.diagnosis.activity).toEqual(23);
    expect(response.body.diagnosis.actions).toEqual(23);
    expect(response.body.diagnosis.conciliatory_attitude).toEqual(9);
    expect(response.body.diagnosis.need_for_achievement).toEqual(23);

    expect(response.body.diagnosis.impulsivity).toEqual(21);
    expect(response.body.diagnosis.excitement_seeking).toEqual(9);
    expect(response.body.diagnosis.ideas).toEqual(9);
    expect(response.body.diagnosis.modesty).toEqual(21);
    expect(response.body.diagnosis.self_discipline).toEqual(11);

    expect(response.body.diagnosis.vulnerability).toEqual(9);
    expect(response.body.diagnosis.positive_emotions).toEqual(25);
    expect(response.body.diagnosis.values).toEqual(23);
    expect(response.body.diagnosis.sensitivity_to_others).toEqual(9);
    expect(response.body.diagnosis.deliberation).toEqual(23);

    expect(response.body.diagnosis.neuroticism_x_emotional_stability).toEqual(92);
    expect(response.body.diagnosis.extraversion).toEqual(98);
    expect(response.body.diagnosis.openness_to_experience).toEqual(96);
    expect(response.body.diagnosis.agreeableness_or_amiability).toEqual(94);
    expect(response.body.diagnosis.perseverance_or_responsibility).toEqual(98);
    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("fail submit responses;ya esta terminado; status 409 ", async () => {



    const responsesData = {
      responses: [0, 0, 0, 0, 0, 0, 0, 0]
    };

    const response = await request(app)
      .patch("/diagnoses/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(responsesData);


    if (response.status !== 409) {
      console.log("Response bodddddy:", response.body);
    }

    expect(response.body).toEqual({ "message": "Diangosis already submitted" });

    expect(response.status).toBe(409);
  });
});


// borrado de lo creado
afterAll(async () => {
  await prisma.result.deleteMany();
  await prisma.userResponses.deleteMany();
  await prisma.user.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
