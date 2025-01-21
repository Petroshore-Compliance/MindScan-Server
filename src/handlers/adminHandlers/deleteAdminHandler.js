const { deleteAdminController } = require("../../controllers/adminControllers/deleteAdminController.js");


const deleteAdminHandler = async (req, res) => {
  try {
    const response = await deleteAdminController(req.body);

    return res.status(response.status).json({ message: response.message });

  } catch (error) {
    return res.status(500).json({ message: `Unsuported error finding email ${error}` });
  }
}
module.exports = { deleteAdminHandler };