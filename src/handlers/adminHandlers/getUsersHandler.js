const { token } = require("morgan");
const {
  getUsersController,
} = require("../../controllers/adminControllers/getUsersController.js");

const getUsersHandler = async (req, res) => {
  try {
    const response = await getUsersController(req.body);

    return res
      .status(response.status)
      .json({ message: response.message, users: response.users, page: response.page, totalPages: response.totalPages });
  } catch (error) {
    return res.status(500).json({ message: `Unsuported error login admin ${error}` });
  }
};
module.exports = { getUsersHandler };
