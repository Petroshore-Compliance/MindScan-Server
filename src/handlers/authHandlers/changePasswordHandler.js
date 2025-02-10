const {
  changePasswordController,
} = require("../../controllers/authControllers/changePasswordController.js");

const changePasswordHandler = async (req, res) => {
  try {

    const response = await changePasswordController(req.body);

    res.status(response.status).json({ message: response.message });
  } catch (error) {
    res.status(500).json({ message: "Unsuported error changing password", error: error.message });
  }
};

module.exports = { changePasswordHandler };
