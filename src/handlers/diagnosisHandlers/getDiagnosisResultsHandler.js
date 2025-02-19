const {
  getDiagnosisResultsController,
} = require("../../controllers/diagnosisControllers/getDiagnosisResultsController.js");

const getDiagnosisResultsHandler = async (req, res) => {
  try {

    const response = await getDiagnosisResultsController(req.body);

    return res.status(response.status).json({ message: response.message, diagnosisResult: response.diagnosisResult, diagnosisSummary: response.diagnosisSummary });
  } catch (error) {
    res.status(500).json({ message: "Unhandled error getting diagnosis results", error: error.message });
  }
};

module.exports = { getDiagnosisResultsHandler };
