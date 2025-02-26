const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { createInvitationMiddleware, } = require("../middlewares/invitationsMiddlewares/createInvitationMiddleware.js");
const { updateInvitationMiddleware, } = require("../middlewares/invitationsMiddlewares/updateInvitationMiddleware.js");
const { getInvitationMiddleware } = require("../middlewares/invitationsMiddlewares/getInvitationMiddleware.js");
const { roleMiddleware } = require("../middlewares/roleMiddleware.js");

const { createInvitationHandler, } = require("../handlers/invitationsHandlers/createInvitationHandler.js");
const { updateInvitationHandler, } = require("../handlers/invitationsHandlers/updateInvitationHandler.js");
const { getInvitationHandler } = require("../handlers/invitationsHandlers/getInvitationHandler.js");

router.post("/create-invitation", authMiddleware, createInvitationMiddleware, createInvitationHandler);
router.patch("/update-invitation", authMiddleware, roleMiddleware, updateInvitationMiddleware, updateInvitationHandler);
router.get("/get-invitation", authMiddleware, roleMiddleware, getInvitationMiddleware, getInvitationHandler);

module.exports = router;
