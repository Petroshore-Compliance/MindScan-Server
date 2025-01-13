const {loginAdminController} = require("../../controllers/adminControllers/loginAdminController.js");


const loginAdminHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await loginAdminController(email);

    res.status(response.status).json({  message: response.message });

  }catch (error) {
    res.status(500).json({ message: `Unsuported error login admin ${error}` });
  }
}
module.exports = { loginAdminHandler };