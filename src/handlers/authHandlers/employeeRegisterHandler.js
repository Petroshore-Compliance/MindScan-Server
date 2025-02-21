const {
  employeeRegisterController,
} = require("../../controllers/authControllers/employeeRegisterController.js");

const employeeRegisterHandler = async (req, res) => {
  try {

    const response = await employeeRegisterController(req.body);

    res.status(response.status).json({ message: response.message });
  } catch (error) {
    res.status(500).json({ message: "Unsuported error employee register", error: error.message });
  }
};

module.exports = { employeeRegisterHandler };
