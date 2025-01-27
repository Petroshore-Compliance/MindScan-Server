const { token } = require("morgan");
const { loginAdminController } = require("../../controllers/adminControllers/loginAdminController.js");


const loginAdminHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await loginAdminController(email, password);

    return res.status(response.status).json({ message: response.message, token: response.token, admin: response.petroAdmin });

  } catch (error) {
    return res.status(500).json({ message: `Unsuported error login admin ${error}` });
  }
}
module.exports = { loginAdminHandler };