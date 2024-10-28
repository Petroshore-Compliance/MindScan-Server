const { verificateUserController } = require("../controllers/verificateUserController.js");

const verificateUserHandler = async (req, res) => {
  const { user_id, verificationCode } = req.body;

  try {
    const result = await verificateUserController(user_id, verificationCode);

    switch (result.message) {
      case "Missing parameters":
        return res.status(400).json({ message: result.message });
      case "The user does not exist":
        return res.status(404).json({ message: result.message });
      case "The user is already verified":
        return res.status(400).json({ message: result.message });
      case "User verified successfully":
        return res.status(200).json({ message: result.message });
      default:
        return res.status(500).json({ message: "An unknown error occurred.", error: result.error});
    }
    }
  catch (error) {
res.status(500).json({ message: "An error occurred during verification.", error: error.message });
  }}

module.exports = { verificateUserHandler };
