const {updateAdminController} = require("../../controllers/adminControllers/updateAdminController.js");


const updateAdminHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await updateAdminController(email);

    res.status(response.status).json({  message: response.message});

  }catch (error) {
    res.status(500).json({ message: `Unsuported error updating admin ${error}` });
  }
}
module.exports = { updateAdminHandler };