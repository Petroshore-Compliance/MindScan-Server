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
  it("success getDiagnosisResult;status 200 ", async () => {

    await prisma.result.create({
      data: {
        user_id: userId,
        company_id: companyId,

        anxiety: 3,
        hostility: 3,
        depression: 3,
        social_anxiety: 3,
        impulsivity: 3,
        vulnerability: 3,

        cordiality: 3,
        gregariousness: 3,
        assertiveness: 3,
        activity: 3,
        excitement_seeking: 3,
        positive_emotions: 3,

        fantasy: 3,
        aesthetic_appreciation: 3,
        feelings: 3,
        actions: 3,
        ideas: 3,
        values: 3,

        trust: 3,
        frankness: 3,
        altruism: 3,
        conciliatory_attitude: 3,
        modesty: 3,
        sensitivity_to_others: 3,

        competence: 3,
        orderliness: 3,
        sense_of_duty: 3,
        need_for_achievement: 3,
        self_discipline: 3,
        deliberation: 3,

        neuroticism_x_emotional_stability: 3,
        extraversion: 3,
        openness_to_experience: 3,
        agreeableness_or_amiability: 3,
        perseverance_or_responsibility: 3,

        created_at: new Date(),
      },
    });



    const diagnosis = await prisma.result.findFirst({})

    const diagnosisResultId = diagnosis.result_id;


    const diagnosisData = {
      employeeEmail: userEmail,
      result_id: diagnosisResultId


    };

    const response = await request(app)
      .get("/diagnoses/employee-diagnoses")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .query({ role: "manager" })
      .send(diagnosisData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toEqual("questionResponses found");
    expect(response.body.diagnosisResult).toEqual([{ "actions": 3, "activity": 3, "aesthetic_appreciation": 3, "altruism": 3, "anxiety": 3, "assertiveness": 3, "competence": 3, "conciliatory_attitude": 3, "cordiality": 3, "deliberation": 3, "depression": 3, "excitement_seeking": 3, "fantasy": 3, "feelings": 3, "frankness": 3, "gregariousness": 3, "hostility": 3, "ideas": 3, "impulsivity": 3, "modesty": 3, "need_for_achievement": 3, "orderliness": 3, "positive_emotions": 3, "self_discipline": 3, "sense_of_duty": 3, "sensitivity_to_others": 3, "social_anxiety": 3, "trust": 3, "values": 3, "vulnerability": 3 }]);
    expect(response.body.diagnosisSummary).toEqual({ "agreeableness_or_amiability": 3, "extraversion": 3, "neuroticism_x_emotional_stability": 3, "openness_to_experience": 3, "perseverance_or_responsibility": 3 });
    expect(response.status).toBe(200);
  });
});

describe("Auth Endpoints", () => {
  it("success getDiagnosisResult;status 200 ", async () => {

    await prisma.result.create({
      data: {
        user_id: userId,
        company_id: companyId,

        anxiety: 3,
        hostility: 3,
        depression: 3,
        social_anxiety: 3,
        impulsivity: 3,
        vulnerability: 3,

        cordiality: 3,
        gregariousness: 3,
        assertiveness: 3,
        activity: 3,
        excitement_seeking: 3,
        positive_emotions: 3,

        fantasy: 3,
        aesthetic_appreciation: 3,
        feelings: 3,
        actions: 3,
        ideas: 3,
        values: 3,

        trust: 3,
        frankness: 3,
        altruism: 3,
        conciliatory_attitude: 3,
        modesty: 3,
        sensitivity_to_others: 3,

        competence: 3,
        orderliness: 3,
        sense_of_duty: 3,
        need_for_achievement: 3,
        self_discipline: 3,
        deliberation: 3,

        neuroticism_x_emotional_stability: 3,
        extraversion: 3,
        openness_to_experience: 3,
        agreeableness_or_amiability: 3,
        perseverance_or_responsibility: 3,

        created_at: new Date(),
      },
    });


    const diagnosisData = {
      employeeEmail: userEmail,

    };

    const response = await request(app)
      .get("/diagnoses/employee-diagnoses")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .query({ role: "manager" })
      .send(diagnosisData);

    if (response.status !== 200) {
      console.log("Response body:", response.body);
    }
    expect(response.body.message).toEqual("questionResponses found");
    expect(response.body.diagnoses).toHaveLength(2);

    expect(response.status).toBe(200);
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
