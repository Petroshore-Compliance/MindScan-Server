const { Router } = require("express");
const router = Router();

const { launchDiagnosisMiddleware } = require("../middlewares/diagnosisMiddlewares/launchDiagnosisMiddleware.js");
const { submitResponsesMiddleware } = require("../middlewares/diagnosisMiddlewares/submitResponsesMiddleware.js");
const { getQuestionAnswersMiddleware } = require("../middlewares/diagnosisMiddlewares/getQuestionAnswersMiddleware.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");

const { launchDiagnosisHandler } = require("../handlers/diagnosisHandlers/launchDiagnosisHandler.js");
const { submitResponsesHandler } = require("../handlers/diagnosisHandlers/submitResponsesHandler.js");
const { getQuestionAnswersHandler } = require("../handlers/diagnosisHandlers/getQuestionAnswersHandler.js");

router.post("/launch", authMiddleware, launchDiagnosisMiddleware, launchDiagnosisHandler);
router.patch("/submit", authMiddleware, submitResponsesMiddleware, submitResponsesHandler);
router.get("/get-answers", authMiddleware, getQuestionAnswersMiddleware, getQuestionAnswersHandler);

module.exports = router;