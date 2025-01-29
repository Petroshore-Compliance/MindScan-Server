const bcrypt = require("bcrypt");

const { inviteController } = require("../../controllers/companiesControllers/inviteController.js");

const inviteHandler = async (req, res) => {
  try {
    const response = await inviteController(req.body);
    return res
      .status(response.status)
      .json({ message: response.message, invitation: response.invitation });
  } catch (error) {
    return res.status(500).json({ errors: error.message });
  }
};

module.exports = { inviteHandler };
