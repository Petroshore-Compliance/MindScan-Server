const {
  registerUserController,
} = require("../../controllers/authControllers/registerUserController.js");

const registerUserHandler = async (req, res) => {
  try {
    const { email, password, name, role, company_id } = req.body;

    const response = await registerUserController(email, password, name, role, company_id);

    res.status(response.status).json({ message: response.message, user: response.user });
  } catch (error) {
    console.error("Unhandled error registering user:", error);
    res.status(500).json({ message: "Can not register user, try again later" });
  }
};

module.exports = { registerUserHandler };
