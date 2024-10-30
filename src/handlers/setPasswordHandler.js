const { setPasswordController } = require("../controllers/setPasswordController.js");




const setPasswordHandler = async (req, res) => {
  try {
    const {user_id, newPassword} = req.body;

    const response = await setPasswordController(user_id, newPassword);
  res.status(response.status).json({ message: response });

  } catch (error) {
    res.status(500).json({ message: `Unsuported error setting password ${error}` });
  }
}
module.exports = { setPasswordHandler };