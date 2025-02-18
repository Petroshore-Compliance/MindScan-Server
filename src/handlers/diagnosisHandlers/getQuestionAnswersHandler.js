const {
  getQuestionAnswersController,
} = require("../../controllers/diagnosisControllers/getQuestionAnswersController.js");

const getQuestionAnswersHandler = async (req, res) => {
  try {

    const response = await getQuestionAnswersController(req.body);

    return res.status(response.status).json({ message: response.message, questionResponses: response.questionResponses });
  } catch (error) {
    res.status(500).json({ message: "Unhandled error launching diagnosis", error: error.message });
  }
};

module.exports = { getQuestionAnswersHandler };
