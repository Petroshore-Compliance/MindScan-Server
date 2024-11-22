const { registerUserController } = require("../../controllers/authControllers/registerUserController.js");

const registerUserHandler = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      user_type,
      
    } = req.body;

    const response = await registerUserController(
      email,
      password,
      name,
      user_type,
      
    );

res.status(response.status).json({ message: response.message});


  } catch (error) {
    console.error("Unhandled error registering user:", error);
    res.status(500).json({ message: "Can not register user, try again later" });
  }
};

module.exports = { registerUserHandler };
