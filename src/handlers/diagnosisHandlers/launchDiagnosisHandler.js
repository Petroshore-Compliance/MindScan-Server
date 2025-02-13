const {
  launchDiagnosisController,
} = require("../../controllers/diagnosisControllers/launchDiagnosisController.js");

const launchDiagnosisHandler = async (req, res) => {
  try {

    const response = await launchDiagnosisController(req.body);

    return res.status(response.status).json({ message: response.message, questions: response.questions, page: response.page });
  } catch (error) {
    res.status(500).json({ message: "Unhandled error launching diagnosis", error: error.message });
  }
};

module.exports = { launchDiagnosisHandler };
