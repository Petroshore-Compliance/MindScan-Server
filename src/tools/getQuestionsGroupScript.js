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

  const groupIndex = page - 1; // Change this for the desired group index: 0 for first 8, 1 for second, etc.
  const groupSize = 8; //NO CAMBIAR este número esta aquí por comodidad

  // Now run your query using the dynamic selection
  const questionsGroup = await prisma.question.findMany({
    orderBy: { question_id: 'asc' },
    skip: groupIndex * groupSize,
    take: groupSize,
    select: getQuestionSelection(language)
  });
  return { questions: questionsGroup, page: page }
};





module.exports = { getQuestionsGroupScript };