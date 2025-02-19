const prisma = require("../../db.js");

const getDiagnosisResultsController = async (data) => {

  const diagnosis = await prisma.result.findMany({
    where: {
      user_id: data.user.user_id,
      company_id: data.user.company_id,
    },

  });
  const sanitizedDiagnosis = diagnosis.map(({ user_id, company_id, created_at, updated_at, resultado_id, ...rest }) => rest);

  const nonSummary = sanitizedDiagnosis.map(({ neuroticism_x_emotional_stability, extraversion, openness_to_experience, agreeableness_or_amiability, perseverance_or_responsibility, ...rest }) => rest);

  let diagnosisSummary = diagnosis.length > 0 ? {
    neuroticism_x_emotional_stability: diagnosis[0].neuroticism_x_emotional_stability,
    extraversion: diagnosis[0].extraversion,
    openness_to_experience: diagnosis[0].openness_to_experience,
    agreeableness_or_amiability: diagnosis[0].agreeableness_or_amiability,
    perseverance_or_responsibility: diagnosis[0].perseverance_or_responsibility
  } : null;


  console.log(diagnosisSummary);

  return { status: 200, message: "questionResponses found", diagnosisResult: nonSummary, diagnosisSummary: diagnosisSummary };

};

module.exports = { getDiagnosisResultsController };