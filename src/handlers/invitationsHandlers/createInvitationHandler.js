const {createInvitationController} = require("../../controllers/invitationsControllers/createInvitationController.js");

const createInvitationHandler = async (req, res) => {
try {
  const response = await createInvitationController(req.body);
  
return res.status(response.status).json(response.message);
} catch (error) {
  res.status(500).json({ message: "Error al crear la invitación", error: error.message });
}
}

module.exports = {createInvitationHandler};