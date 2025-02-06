const {
  changePasswordAdminController,
} = require("../../controllers/adminControllers/changePasswordAdminController.js");

const changePasswordAdminHandler = async (req, res) => {
  try {
    const response = await changePasswordAdminController(req.body);

    return res.status(response.status).json({ message: response.message, URL: response.URL });
  } catch (error) {
    return res.status(500).json({ message: `Unsuported error finding email ${error}` });
  }
};
module.exports = { changePasswordAdminHandler };
