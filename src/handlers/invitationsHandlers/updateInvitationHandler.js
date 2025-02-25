const {
  updateInvitationController,
} = require("../../controllers/invitationsControllers/updateInvitationController.js");

const updateInvitationHandler = async (req, res) => {
  try {
    const response = await updateInvitationController(req.body);

    return res.status(response.status).json(response.message);
  } catch (error) {
    res.status(500).json({ message: "Error updating invitation controller", error: error.message });
  }
};

module.exports = { updateInvitationHandler };
