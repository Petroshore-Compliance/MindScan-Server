const { Router } = require("express");
const router = Router();

const { getProfileHandler } = require("../handlers/userHandlers/getProfileHandler.js");
const { updateProfileHandler } = require("../handlers/userHandlers/updateProfileHandler.js");

router.get("/me", getProfileHandler);
router.patch("/update-profile", updateProfileHandler);

module.exports = router;