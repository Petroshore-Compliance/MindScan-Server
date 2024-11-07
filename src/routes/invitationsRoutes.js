const { Router } = require("express");
const router = Router();

const { createInvitationHandler } = require("../handlers/invitationsHandlers/createInvitationHandler.js");


router.post("/create-invitation", createInvitationHandler);


module.exports = router;