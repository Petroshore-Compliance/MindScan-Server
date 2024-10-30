const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { getProfileHandler } = require("../handlers/userHandlers/getProfileHandler.js");

router.get("/me", authMiddleware, getProfileHandler);

module.exports = router;