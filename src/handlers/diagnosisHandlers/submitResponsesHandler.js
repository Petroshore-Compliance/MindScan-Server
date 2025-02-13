const {
  submitResponsesController,
} = require("../../controllers/diagnosisControllers/submitResponsesController.js");

const submitResponsesHandler = async (req, res) => {
  try {

    const response = await submitResponsesController(req.body);

    return res.status(response.status).json({ message: response.message, updatedDiagnosis: response.updatedDiagnosis, diagnosis: response.diagnosis });
  } catch (error) {
    res.status(500).json({ message: "Unhandled error submitting responses", error: error.message });
  }
};

module.exports = { submitResponsesHandler };
