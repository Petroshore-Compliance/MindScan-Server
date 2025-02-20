const {
  getDiagnosisResultsController,
} = require("../../controllers/diagnosisControllers/getDiagnosisResultsController.js");

const getDiagnosisResultsHandler = async (req, res) => {
  try {

    const response = await getDiagnosisResultsController(req.body);

    res.status(response.status).json({ message: response.message, diagnosisResult: response.diagnosisResult, diagnosisSummary: response.diagnosisSummary, diagnoses: response.diagnoses });

  } catch (error) {
    res.status(500).json({ message: "Unhandled error getting diagnosis results", error: error.message });
  }
};

module.exports = { getDiagnosisResultsHandler };
