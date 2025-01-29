const {
  changePasswordController,
} = require("../../controllers/authControllers/changePasswordController.js");

const changePasswordHandler = async (req, res) => {
  try {
    const { user_id, password, newPassword } = req.body;

    const response = await changePasswordController(user_id, password, newPassword);

    res.status(response.status).json({ message: response.message });
  } catch (error) {
    res.status(500).json({ message: "Unsuported error changing password", error: error.message });
  }
};

module.exports = { changePasswordHandler };
