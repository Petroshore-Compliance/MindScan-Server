const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { getProfileMiddleware } = require("../middlewares/userMiddlewares/getProfileMiddleware.js");

const { getProfileHandler } = require("../handlers/usersHandlers/getProfileHandler.js");
const { updateProfileHandler } = require("../handlers/usersHandlers/updateProfileHandler.js");

router.get("/me", authMiddleware, getProfileMiddleware, getProfileHandler);
router.patch("/update-profile", updateProfileHandler);

module.exports = router;