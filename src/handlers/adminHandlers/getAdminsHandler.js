const {
  getAdminsController,
} = require("../../controllers/adminControllers/getAdminsController.js");
const { petroAdmin } = require("../../db.js");

const getAdminsHandler = async (req, res) => {
  try {
    const response = await getAdminsController(req.body);

    return res.status(response.status).json({
      message: response.message,
      petroAdmins: response.petroAdmins,
      petroAdmin: response.petroAdmin,
    });
  } catch (error) {
    return res.status(500).json({ message: `Unsuported error finding admins ${error}` });
  }
};
module.exports = { getAdminsHandler };
