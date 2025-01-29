const {
  forgotPasswordController,
} = require("../../controllers/authControllers/forgotPasswordController.js");

const forgotPasswordHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await forgotPasswordController(email);

    res.status(response.status).json({ message: response.message, URL: response.URL });
  } catch (error) {
    res.status(500).json({ message: `Unsuported error finding email ${error}` });
  }
};
module.exports = { forgotPasswordHandler };
