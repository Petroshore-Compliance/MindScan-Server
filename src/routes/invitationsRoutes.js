const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { createInvitationMiddleware } = require("../middlewares/invitationsMiddlewares/createInvitationMiddleware.js");

const { createInvitationHandler } = require("../handlers/invitationsHandlers/createInvitationHandler.js");

router.post("/create-invitation",authMiddleware, createInvitationMiddleware,createInvitationHandler);



module.exports = router;