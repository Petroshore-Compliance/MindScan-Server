const prisma = require("../db.js");



const getQuestionsGroupScript = async (language, page) => {


  function getQuestionSelection(language) {
    const selection = { inverted: true };
    if (language === 'es') {
      selection.content_es = true;
    } else if (language === 'en') {
      selection.content_en = true;
    } else if (language === 'pt') {
      selection.content_pt = true;
    }
    return selection;
  }

  const groupIndex = page - 1;
  const groupSize = 8; //NO CAMBIAR este número esta aquí por comodidad

  const questionsGroup = await prisma.question.findMany({
    orderBy: { question_id: 'asc' },
    skip: groupIndex * groupSize,
    take: groupSize,
    select: getQuestionSelection(language)
  });
  return { questions: questionsGroup, page: page }
};





module.exports = { getQuestionsGroupScript };