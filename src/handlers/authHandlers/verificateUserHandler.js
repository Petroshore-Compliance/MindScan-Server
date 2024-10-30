const { verificateUserController } = require("../../controllers/authControllers/verificateUserController.js");

const verificateUserHandler = async (req, res) => {
  const { user_id, verificationCode } = req.body;

  try {
    const result = await verificateUserController(user_id, verificationCode);

    res.status(result.status).json({ message: result.message });
    }
  catch (error) {
res.status(500).json({ message: "An error occurred during verification.", error: error.message });
  }}

module.exports = { verificateUserHandler };
