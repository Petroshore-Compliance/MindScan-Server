const prisma = require("../../db.js");

const { getQuestionsGroupScript } = require("../../tools/getQuestionsGroupScript.js");

const launchDiagnosisController = async (data) => {


  const user = await prisma.user.findUnique({
    where: {
      user_id: data.user.user_id
    }
  })
  if (user.company_id == null) {
    return { status: 422, message: "You must be part of a company to launch a diagnosis" }
  }

  const diagnoseStarted = await prisma.UserResponses.findUnique({
    where: {
      user_id_company_id: {
        user_id: user.user_id,
        company_id: user.company_id,
      },
    },
  });

  if (diagnoseStarted) {


    const nextPage = diagnoseStarted.responses.length / 8 + 1;

    const questionsGroup = await getQuestionsGroupScript(data.language, nextPage);
    if (nextPage == 30) { return { status: 200, message: "Diagnosis last page", questions: questionsGroup.questions, page: questionsGroup.page } }
    if (nextPage == 31) { return { status: 409, message: "Diagnosis already completed", questions: questionsGroup.questions, page: questionsGroup.page } }

    return { status: 206, message: "Diagnosis continued", questions: questionsGroup.questions, page: questionsGroup.page }

  }
  else {
    const company = await prisma.company.findUnique({
      where: {
        company_id: user.company_id
      }
    })

    if (company.licenses == 0) {
      return { status: 402, message: "Not enough licenses" }
    }
    await prisma.$transaction(async (prisma) => {
      await prisma.company.update({
        where: {
          company_id: user.company_id
        },
        data: {
          licenses: {
            decrement: 1
          }
        }
      });

      await prisma.UserResponses.create({
        data: {
          user: {
            connect: { user_id: user.user_id }
          },
          company: {
            connect: { company_id: user.company_id }
          }
        }
      });
    });



    const questionsGroup = await getQuestionsGroupScript(data.language, 1);


    return { status: 201, message: "Diagnosis started", questions: questionsGroup.questions, page: questionsGroup.page }


  }

}

module.exports = { launchDiagnosisController };