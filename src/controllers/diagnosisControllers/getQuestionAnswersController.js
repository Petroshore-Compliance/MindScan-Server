const prisma = require("../../db.js");

const getQuestionAnswersController = async (data) => {
  console.log(data);

  function getQuestionSelection(language) {
    const selection = {};
    if (language === "es") {
      selection.answer_es = true;
    } else if (language === "en") {
      selection.answer_en = true;
    } else if (language === "pt") {
      selection.answer_pt = true;
    }
    return selection;
  }


  const questionResponses = await prisma.questionAnswer.findMany({
    select: getQuestionSelection(data.language),
  });


  return {
    status: 200,
    message: "questionResponses found",
    questionResponses,
  };
};

module.exports = { getQuestionAnswersController };