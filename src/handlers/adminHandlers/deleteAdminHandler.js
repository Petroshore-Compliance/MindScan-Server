const {deleteAdminController} = require("../../controllers/adminControllers/deleteAdminController.js");


const deleteAdminHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await deleteAdminController(email);

    res.status(response.status).json({  message: response.message });

  }catch (error) {
    res.status(500).json({ message: `Unsuported error finding email ${error}` });
  }
}
module.exports = { deleteAdminHandler };