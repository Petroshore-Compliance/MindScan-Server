const { Router } = require("express");
const router = Router();

const { adminMiddleware } = require("../middlewares/adminMiddleware.js");
const { getAdminsMiddleware } = require("../middlewares/adminMiddlewares/getAdminsMiddleware.js");
const { updateAdminMiddleware } = require("../middlewares/adminMiddlewares/updateAdminMiddleware.js");
const { deleteAdminMiddleware } = require("../middlewares/adminMiddlewares/deleteAdminMiddleware.js");
const { createAdminMiddleware } = require("../middlewares/adminMiddlewares/createAdminMiddleware.js");
const { loginAdminMiddleware } = require("../middlewares/adminMiddlewares/loginAdminMiddleware.js");
const { forgotPasswordAdminMiddleware } = require("../middlewares/adminMiddlewares/forgotPasswordAdminMiddleware.js");
const { setPasswordAdminMiddleware } = require("../middlewares/adminMiddlewares/setPasswordAdminMiddleware.js");
const { changePasswordAdminMiddleware } = require("../middlewares/adminMiddlewares/changePasswordAdminMiddleware.js");

const { getAdminsHandler } = require("../handlers/adminHandlers/getAdminsHandler.js");
const { updateAdminHandler } = require("../handlers/adminHandlers/updateAdminHandler.js");
const { deleteAdminHandler } = require("../handlers/adminHandlers/deleteAdminHandler.js");
const { createAdminHandler } = require("../handlers/adminHandlers/createAdminHandler.js");
const { loginAdminHandler } = require("../handlers/adminHandlers/loginAdminHandler.js");
const { forgotPasswordAdminHandler } = require("../handlers/adminHandlers/forgotPasswordAdminHandler.js");
const { setPasswordAdminHandler } = require("../handlers/adminHandlers/setPasswordAdminHandler.js");
const { changePasswordAdminHandler } = require("../handlers/adminHandlers/changePasswordAdminHandler.js");

router.post("/create", createAdminMiddleware, createAdminHandler);
router.post("/login", loginAdminMiddleware, loginAdminHandler);
router.patch("/update", adminMiddleware, updateAdminMiddleware, updateAdminHandler);
router.patch("/set-password", setPasswordAdminMiddleware, setPasswordAdminHandler);
router.patch("/change-password", adminMiddleware, changePasswordAdminMiddleware, changePasswordAdminHandler);
router.get("/forgot-password", forgotPasswordAdminMiddleware, forgotPasswordAdminHandler);
router.get("/get", adminMiddleware, getAdminsMiddleware, getAdminsHandler);
router.delete("/delete", adminMiddleware, deleteAdminMiddleware, deleteAdminHandler);

module.exports = router;