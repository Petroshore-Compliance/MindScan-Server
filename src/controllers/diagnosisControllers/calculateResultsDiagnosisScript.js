const prisma = require("../../db.js");

const calculateResultsDiagnosisScript = async (rawDiagnostic) => {
  console.log("rawDiagnostic", rawDiagnostic.responses_value);
  const groupSum = (arr, start, groupSize = 8) =>
    arr.slice(start, start + groupSize).reduce((sum, value) => sum + value, 0);

  const anxiety = groupSum(rawDiagnostic.responses_value, 0);
  const cordiality = groupSum(rawDiagnostic.responses_value, 8);
  const fantasy = groupSum(rawDiagnostic.responses_value, 16);
  const trust = groupSum(rawDiagnostic.responses_value, 24);
  const competence = groupSum(rawDiagnostic.responses_value, 32);

  const hostility = groupSum(rawDiagnostic.responses_value, 40);
  const gregariousness = groupSum(rawDiagnostic.responses_value, 48);
  const aesthetic_appreciation = groupSum(rawDiagnostic.responses_value, 56);
  const frankness = groupSum(rawDiagnostic.responses_value, 64);
  const orderliness = groupSum(rawDiagnostic.responses_value, 72);

  const depression = groupSum(rawDiagnostic.responses_value, 80);
  const assertiveness = groupSum(rawDiagnostic.responses_value, 88);
  const feelings = groupSum(rawDiagnostic.responses_value, 96);
  const altruism = groupSum(rawDiagnostic.responses_value, 104);
  const sense_of_duty = groupSum(rawDiagnostic.responses_value, 112);

  const social_anxiety = groupSum(rawDiagnostic.responses_value, 120);
  const activity = groupSum(rawDiagnostic.responses_value, 128);
  const actions = groupSum(rawDiagnostic.responses_value, 136);
  const conciliatory_attitude = groupSum(rawDiagnostic.responses_value, 144);
  const need_for_achievement = groupSum(rawDiagnostic.responses_value, 152);

  const impulsivity = groupSum(rawDiagnostic.responses_value, 160);
  const excitement_seeking = groupSum(rawDiagnostic.responses_value, 168);
  const ideas = groupSum(rawDiagnostic.responses_value, 176);
  const modesty = groupSum(rawDiagnostic.responses_value, 184);
  const self_discipline = groupSum(rawDiagnostic.responses_value, 192);

  const vulnerability = groupSum(rawDiagnostic.responses_value, 200);
  const positive_emotions = groupSum(rawDiagnostic.responses_value, 208);
  const values = groupSum(rawDiagnostic.responses_value, 216);
  const sensitivity_to_others = groupSum(rawDiagnostic.responses_value, 224);
  const deliberation = groupSum(rawDiagnostic.responses_value, 232);

  const neuroticism_x_emotional_stability = anxiety + hostility + depression + social_anxiety + impulsivity + vulnerability;
  const extraversion = cordiality + gregariousness + assertiveness + activity + excitement_seeking + positive_emotions;

  const openness_to_experience =
    fantasy + aesthetic_appreciation + feelings + actions + ideas + values;

  const agreeableness_or_amiability =
    trust + frankness + altruism + conciliatory_attitude + modesty + sensitivity_to_others;

  const perseverance_or_responsibility =
    competence + orderliness + sense_of_duty + need_for_achievement + self_discipline + deliberation;

  try {
    const resultOfDiagnosis = await prisma.result.create({
      data: {
        user_id: rawDiagnostic.user_id,
        company_id: rawDiagnostic.company_id,

        anxiety,
        hostility,
        depression,
        social_anxiety,
        impulsivity,
        vulnerability,

        cordiality,
        gregariousness,
        assertiveness,
        activity,
        excitement_seeking,
        positive_emotions,

        fantasy,
        aesthetic_appreciation,
        feelings,
        actions,
        ideas,
        values,

        trust,
        frankness,
        altruism,
        conciliatory_attitude,
        modesty,
        sensitivity_to_others,

        competence,
        orderliness,
        sense_of_duty,
        need_for_achievement,
        self_discipline,
        deliberation,

        neuroticism_x_emotional_stability,
        extraversion,
        openness_to_experience,
        agreeableness_or_amiability,
        perseverance_or_responsibility,
      },
    });
    return resultOfDiagnosis;
  } catch (error) {
    console.error("Error storing diagnosis result:", error);
  }
};

module.exports = { calculateResultsDiagnosisScript };