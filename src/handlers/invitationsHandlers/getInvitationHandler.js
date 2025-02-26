const {
  getInvitationController,
} = require("../../controllers/invitationsControllers/getInvitationController.js");

const getInvitationHandler = async (req, res) => {
  try {
    const response = await getInvitationController(req.body);

    return res.status(response.status).json({ message: response.message, invitation: response.invitation });
  } catch (error) {
    res.status(500).json({ message: "Error getting invitation", error: error.message });
  }
};

module.exports = { getInvitationHandler };
