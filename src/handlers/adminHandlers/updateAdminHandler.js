const { updateAdminController } = require("../../controllers/adminControllers/updateAdminController.js");


const updateAdminHandler = async (req, res) => {
  try {
    const { adminEmail, ...dataWithoutAdminEmail } = req.body;
    const response = await updateAdminController(dataWithoutAdminEmail);

    return res.status(response.status).json({ message: response.message });

  } catch (error) {
    return res.status(500).json({ message: `Unsuported error updating admin ${error}` });
  }
}
module.exports = { updateAdminHandler };