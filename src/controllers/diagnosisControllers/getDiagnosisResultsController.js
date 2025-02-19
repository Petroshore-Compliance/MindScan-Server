const prisma = require("../../db.js");

const getDiagnosisResultsController = async (data) => {



  const diagnosis = await prisma.result.findMany({
    where: {
      user_id: data.user.user_id,
      company_id: data.user.company_id,
    },

  });
  const sanitizedDiagnosis = diagnosis.map(({ user_id, company_id, created_at, updated_at, resultado_id, ...rest }) => rest);

  console.log(sanitizedDiagnosis);
  return { status: 200, message: "questionResponses found", diagnosisResult: sanitizedDiagnosis };

};

module.exports = { getDiagnosisResultsController };