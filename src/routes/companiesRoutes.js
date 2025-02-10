const { Router } = require("express");
const router = Router();

const { roleMiddleware } = require("../middlewares/roleMiddleware.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const {
  createCompanyMiddleware,
} = require("../middlewares/companiesMiddlewares/createCompanyMiddleware.js");
const {
  getCompanyEmployeesMiddleware,
} = require("../middlewares/companiesMiddlewares/getCompanyEmployeesMiddleware.js");
const {
  getCompanyMiddleware,
} = require("../middlewares/companiesMiddlewares/getCompanyMiddleware.js");
const { inviteMiddleware } = require("../middlewares/companiesMiddlewares/inviteMiddleware.js");

const { createCompanyHandler } = require("../handlers/companiesHandlers/createCompanyHandler.js");
const { getCompanyHandler } = require("../handlers/companiesHandlers/getCompanyHandler.js");
const {
  getCompanyEmployeesHandler,
} = require("../handlers/companiesHandlers/getCompanyEmployeesHandler.js");
const { inviteHandler } = require("../handlers/companiesHandlers/inviteHandler.js");

router.post("/create-company", authMiddleware, createCompanyMiddleware, createCompanyHandler);
router.post("/invite", authMiddleware, roleMiddleware, inviteMiddleware, inviteHandler);
router.get("/get-company", authMiddleware, roleMiddleware, getCompanyMiddleware, getCompanyHandler);
router.get(
  "/get-employees",
  authMiddleware,
  roleMiddleware,
  getCompanyEmployeesMiddleware,
  getCompanyEmployeesHandler
);

module.exports = router;
