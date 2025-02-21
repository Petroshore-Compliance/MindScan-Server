require("dotenv").config();

const request = require("supertest");
const app = require("../../app");
const prisma = require("../../db.js");
const { EMAIL_TESTER } = process.env;
let petroAdminId;
const companyEmail = "compania@company.pou";
let companyId;
const userEmail = "user@user.pou";
let userId;
let tokenAdmin;
let token;

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


  await prisma.company.updateMany({

    data: {
      licenses: 1,
    },
  });

  const diagnosisData = {
    language: "en",
  };

  const iwiwi = await request(app)
    .post("/diagnoses/launch")
    .set("Authorization", `Bearer ${token}`)
    .send(diagnosisData);

  console.log(iwiwi.body)
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

    expect(response.body.message).toEqual("Diangosis already submitted");

    expect(response.status).toBe(409);
  });
});


// borrado de lo creado
afterAll(async () => {
  await prisma.result.deleteMany();
  await prisma.userResponses.deleteMany();
  await prisma.user.deleteMany();
  await prisma.petroAdmin.deleteMany();

  await prisma.companyInvitation.deleteMany();
  await prisma.company.deleteMany();

  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});
