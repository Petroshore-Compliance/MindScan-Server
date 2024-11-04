const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { createCompanyHandler } = require("../handlers/companiesHandlers/createCompanyHandler.js");
const { getCompanyHandler } = require("../handlers/companiesHandlers/getCompanyHandler.js");


router.post("/create-company", authMiddleware, createCompanyHandler);
router.get("/get-company", authMiddleware, getCompanyHandler);

module.exports = router;