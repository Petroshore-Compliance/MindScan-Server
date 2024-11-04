const { Router } = require("express");
const router = Router();

const { registerUserHandler } = require("../handlers/authHandlers/registerUserHandler.js");

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { createCompanyHandler } = require("../handlers/companiesHandlers/createCompanyHandler.js");
const { getCompanyHandler } = require("../handlers/companiesHandlers/getCompanyHandler.js");
const { inviteHandler } = require("../handlers/companiesHandlers/inviteHandler.js");



router.post("/create-company", authMiddleware, createCompanyHandler);
router.get("/get-company", authMiddleware, getCompanyHandler);
router.post("/invite",registerUserHandler);

module.exports = router;