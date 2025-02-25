const { Router } = require("express");
const router = Router();

const { roleMiddleware } = require("../middlewares/roleMiddleware.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { adminMiddleware } = require("../middlewares/adminMiddleware.js");

const { employeeReleaseMiddleware } = require("../middlewares/companiesMiddlewares/employeeReleaseMiddleware.js");
const { companyChangeMiddleware } = require("../middlewares/companiesMiddlewares/companyChangeMiddleware.js");
const { createCompanyMiddleware, } = require("../middlewares/companiesMiddlewares/createCompanyMiddleware.js");
const { getCompanyEmployeesMiddleware, } = require("../middlewares/companiesMiddlewares/getCompanyEmployeesMiddleware.js");
const { getCompanyMiddleware } = require("../middlewares/companiesMiddlewares/getCompanyMiddleware.js");
const { inviteMiddleware } = require("../middlewares/companiesMiddlewares/inviteMiddleware.js");

const { employeeReleaseHandler } = require("../handlers/companiesHandlers/employeeReleaseHandler.js");
const { companyChangeHandler } = require("../handlers/companiesHandlers/companyChangeHandler.js");
const { createCompanyHandler } = require("../handlers/companiesHandlers/createCompanyHandler.js");
const { getCompanyHandler } = require("../handlers/companiesHandlers/getCompanyHandler.js");
const { getCompanyEmployeesHandler } = require("../handlers/companiesHandlers/getCompanyEmployeesHandler.js");
const { inviteHandler } = require("../handlers/companiesHandlers/inviteHandler.js");

router.patch("/employee-release", authMiddleware, roleMiddleware, employeeReleaseMiddleware, employeeReleaseHandler);
router.patch("/company-change", authMiddleware, companyChangeMiddleware, companyChangeHandler);
router.post("/create-company", adminMiddleware, createCompanyMiddleware, createCompanyHandler);
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
