const prisma = require("../../db.js");
const { getQuestionsGroupScript } = require("../../tools/getQuestionsGroupScript.js");

const { calculateResultsDiagnosisScript } = require("./calculateResultsDiagnosisScript.js");
let questionsGroup;
const submitResponsesController = async (data) => {

  const user = await prisma.user.findUnique({
    where: {
      user_id: data.user.user_id
    }
  })

  if (user.company_id == null) {
    return { status: 400, message: "You must be part of a company to launch a diagnosis" }
  }


  const diagnoseStarted = await prisma.UserResponses.findUnique({
    where: {
      user_id_company_id: {
        user_id: user.user_id,
        company_id: user.company_id,
      },
    },
  });

  if (!diagnoseStarted) { return { status: 404, message: "No diagnosis started" }; }


  const currentPage = diagnoseStarted.responses.length / 8 + 1;
  questionsGroup = await getQuestionsGroupScript("es", currentPage);

  const isInverted = questionsGroup.questions;


  const newResponses = [...diagnoseStarted.responses];
  const newResponsesValue = [...diagnoseStarted.responses_value];

  if (newResponses.length === 240) {

    return { status: 409, message: "Diangosis already submitted" };
  }

  for (let i = 0; i < 8; i++) {
    if (isInverted[i].inverted) {
      newResponses.push(data.responses[i]);
      newResponsesValue.push(4 - data.responses[i]);
    } else {
      newResponses.push(data.responses[i]);
      newResponsesValue.push(data.responses[i]);
    }
  }

  const updatedDiagnosis = await prisma.UserResponses.update({
    where: {
      user_id_company_id: {
        user_id: user.user_id,
        company_id: user.company_id,
      },
    },
    data: {
      responses: newResponses,
      responses_value: newResponsesValue,
    }
  });


  if (updatedDiagnosis.responses.length === 240) {


    const resultOfDiagnosis = await calculateResultsDiagnosisScript(updatedDiagnosis);

    return { status: 200, message: "Diangosis finished, results calculated", diagnosis: resultOfDiagnosis };
  }

  return { status: 200, message: "Responses submitted", updatedDiagnosis };
}

module.exports = { submitResponsesController };