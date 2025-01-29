const { loginUserController } = require("../../controllers/authControllers/loginUserController.js");

const loginUserHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await loginUserController(email, password);
    res
      .status(response.status)
      .json({ message: response.message, user: response.user, token: response.token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error: error.message });
  }
};

module.exports = { loginUserHandler };
