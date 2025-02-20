const prisma = require("../../db.js");

const getDiagnosisResultsController = async (data) => {

  if (data.result_id) {

    const diagnosis = await prisma.result.findMany({
      where: {
        result_id: parseInt(data.result_id, 10),
        user_id: data.user.user_id,
        company_id: data.user.company_id,
      },

    });

    if (diagnosis.length === 0) {
      return { status: 404, message: "No diagnosis found" };
    }

    const sanitizedDiagnosis = diagnosis.map(({ user_id, company_id, created_at, updated_at, resultado_id, ...rest }) => rest);

    const nonSummary = sanitizedDiagnosis.map(({ neuroticism_x_emotional_stability, extraversion, openness_to_experience, agreeableness_or_amiability, perseverance_or_responsibility, result_id, ...rest }) => rest);

    let diagnosisSummary = diagnosis.length > 0 ? {
      neuroticism_x_emotional_stability: diagnosis[0].neuroticism_x_emotional_stability,
      extraversion: diagnosis[0].extraversion,
      openness_to_experience: diagnosis[0].openness_to_experience,
      agreeableness_or_amiability: diagnosis[0].agreeableness_or_amiability,
      perseverance_or_responsibility: diagnosis[0].perseverance_or_responsibility
    } : null;


    return { status: 200, message: "questionResponses found", diagnosisResult: nonSummary, diagnosisSummary: diagnosisSummary };
  } else {
    const diagnoses = await prisma.result.findMany({
      where: {
        result_id: data.result_id,
        user_id: data.user.user_id,
        company_id: data.user.company_id,
      },
      select: {
        created_at: true,
        result_id: true,
      },
    });

    if (diagnoses.length === 0) {
      return { status: 404, message: "No diagnosis found" };
    }

    const formattedDiagnoses = diagnoses.map((diagnosis) => ({
      ...diagnosis,
      created_at: new Date(diagnosis.created_at)
        .toLocaleDateString("en-GB"),
    }));

    return { status: 200, message: "questionResponses found", diagnoses: formattedDiagnoses };

  }
};

module.exports = { getDiagnosisResultsController };