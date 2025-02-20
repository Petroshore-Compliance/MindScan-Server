const { leaveCompanyController } = require("../../controllers/usersControllers/leaveCompanyController.js");

const leaveCompanyHandler = async (req, res) => {
  try {
    const response = await leaveCompanyController(req.body.user.user_id);

    res.status(response.status).json({ message: response.message, user: response.user });
  } catch (error) {
    res.status(500).json({ message: "Error leaving company", error: error.message });
  }
};

module.exports = { leaveCompanyHandler };
