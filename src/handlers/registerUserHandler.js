const {
  registerUserController,
} = require("../controllers/registerUserController.js");

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
    response
      ? res
          .status(200)
          .json({ message: "User registered successfully", response })
      : res
          .status(400)
          .json({ message: "Can not register user, email already in use" });
  } catch (error) {
    console.error("Unhandled error registering user:", error);
    res.status(500).json({ message: "Can not register user, try again later" });
  }
};

module.exports = { registerUserHandler };
