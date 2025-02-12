const { Router } = require("express");
const router = Router();

const { launchDiagnosisMiddleware } = require("../middlewares/diagnosisMiddlewares/launchDiagnosisMiddleware.js");
const { submitResponsesMiddleware } = require("../middlewares/diagnosisMiddlewares/submitResponsesMiddleware.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");

const { launchDiagnosisHandler } = require("../handlers/diagnosisHandlers/launchDiagnosisHandler.js");
const { submitResponsesHandler } = require("../handlers/diagnosisHandlers/submitResponsesHandler.js");

router.post("/launch", authMiddleware, launchDiagnosisMiddleware, launchDiagnosisHandler);
router.patch("/submit", authMiddleware, submitResponsesMiddleware, submitResponsesHandler);

module.exports = router;