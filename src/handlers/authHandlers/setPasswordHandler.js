const {
  setPasswordController,
} = require("../../controllers/authControllers/setPasswordController.js");

const setPasswordHandler = async (req, res) => {
  try {
    const response = await setPasswordController(req.body);
    res.status(response.status).json({ message: response.message });
  } catch (error) {
    res.status(500).json({ message: `Unsuported error setting password ${error}` });
  }
};
module.exports = { setPasswordHandler };
