const {setPasswordAdminController} = require("../../controllers/adminControllers/setPasswordAdminController.js");


const setPasswordAdminHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await setPasswordAdminController(email);

    res.status(response.status).json({  message: response.message});

  }catch (error) {
    res.status(500).json({ message: `Unsuported error setting password admin ${error}` });
  }
}
module.exports = { setPasswordAdminHandler };