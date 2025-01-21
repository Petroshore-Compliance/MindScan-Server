const { forgotPasswordAdminController } = require("../../controllers/adminControllers/forgotPasswordAdminController.js");


const forgotPasswordAdminHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await forgotPasswordAdminController(email);

    return res.status(response.status).json({ message: response.message });

  } catch (error) {
    return res.status(500).json({ message: `Unsuported error finding email ${error}` });
  }
}
module.exports = { forgotPasswordAdminHandler };