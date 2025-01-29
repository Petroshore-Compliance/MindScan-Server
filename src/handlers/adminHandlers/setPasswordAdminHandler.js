const {
  setPasswordAdminController,
} = require("../../controllers/adminControllers/setPasswordAdminController.js");

const setPasswordAdminHandler = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const response = await setPasswordAdminController(email, newPassword);

    return res.status(response.status).json({ message: response.message });
  } catch (error) {
    return res.status(500).json({ message: `Unsuported error setting password admin ${error}` });
  }
};
module.exports = { setPasswordAdminHandler };
