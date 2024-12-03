const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { createCompanyMiddleware } = require("../middlewares/companiesMiddlewares/createCompanyMiddleware.js");
const {getCompanyMiddleware} = require("../middlewares/companiesMiddlewares/getCompanyMiddleware.js");
const { inviteMiddleware } = require("../middlewares/companiesMiddlewares/inviteMiddleware.js");

const { createCompanyHandler } = require("../handlers/companiesHandlers/createCompanyHandler.js");
const { getCompanyHandler } = require("../handlers/companiesHandlers/getCompanyHandler.js");
const { inviteHandler } = require("../handlers/companiesHandlers/inviteHandler.js");


router.post("/create-company", authMiddleware, createCompanyMiddleware, createCompanyHandler);
router.get("/get-company", authMiddleware,getCompanyMiddleware, getCompanyHandler);
router.post("/invite",authMiddleware,inviteMiddleware, inviteHandler);

module.exports = router;