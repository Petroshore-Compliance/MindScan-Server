const {
  updateProfileController,
} = require("../../controllers/usersControllers/updateProfileController.js");

const updateProfileHandler = async (req, res) => {
  try {
    const response = await updateProfileController(req.body);
    res.status(response.status).json({ message: response.message, user: response.user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unhandled error updating user profile", error: error.message });
  }
};
module.exports = { updateProfileHandler };
