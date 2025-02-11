const { Router } = require("express");
const router = Router();

const { launchDiagnosisMiddleware } = require("../middlewares/diagnosisMiddlewares/launchDiagnosisMiddleware.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");

const { launchDiagnosisHandler } = require("../handlers/diagnosisHandlers/launchDiagnosisHandler.js");

router.post("/launch", authMiddleware, launchDiagnosisMiddleware, launchDiagnosisHandler);

module.exports = router;