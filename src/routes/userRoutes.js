const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { getProfileMiddleware } = require("../middlewares/userMiddlewares/getProfileMiddleware.js");
const {
  updateProfileMiddleware,
} = require("../middlewares/userMiddlewares/updateProfileMiddleware.js");

const { getProfileHandler } = require("../handlers/usersHandlers/getProfileHandler.js");
const { updateProfileHandler } = require("../handlers/usersHandlers/updateProfileHandler.js");
const { leaveCompanyHandler } = require("../handlers/usersHandlers/leaveCompanyHandler.js");

router.get("/me", authMiddleware, getProfileMiddleware, getProfileHandler);
router.patch("/update-profile", authMiddleware, updateProfileMiddleware, updateProfileHandler);
router.patch("/leave-company", authMiddleware, leaveCompanyHandler);

module.exports = router;
