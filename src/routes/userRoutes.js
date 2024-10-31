const { Router } = require("express");
const router = Router();

const { getProfileHandler } = require("../handlers/usersHandlers/getProfileHandler.js");
const { updateProfileHandler } = require("../handlers/usersHandlers/updateProfileHandler.js");

router.get("/me", getProfileHandler);
router.patch("/update-profile", updateProfileHandler);

module.exports = router;