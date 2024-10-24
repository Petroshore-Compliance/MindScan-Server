const { registerUserController } = require("../controllers/registerUserController.js");

const registerUserHandler = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      user_type,
      role,
      companyId,
      responseIds,
      resultIds,
      accessIds,
    } = req.body;

    const response = await registerUserController(
      email,
      password,
      name,
      user_type,
      role,
      companyId,
      responseIds,
      resultIds,
      accessIds
    );
    res.status(200).json({ message: "User registered successfully", response });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

module.exports = { registerUserHandler };
