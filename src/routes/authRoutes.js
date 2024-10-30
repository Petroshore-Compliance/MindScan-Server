const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { registerUserMiddleware } = require("../middlewares/putUserMiddleware.js");

const { changePasswordHandler } = require("../handlers/changePasswordHandler.js");
const { forgotPasswordHandler } = require("../handlers/forgotPasswordHandler.js");
const { loginUserHandler } = require("../handlers/loginUserHandler.js");
const { registerUserHandler } = require("../handlers/registerUserHandler.js");
const { setPasswordHandler } = require("../handlers/setPasswordHandler.js");
const { verificateUserHandler } = require("../handlers/verificateUserHandler.js");

router.post("/register", registerUserMiddleware, registerUserHandler);
router.post("/login", loginUserHandler);
router.get("/verificate-user", verificateUserHandler);
router.get("/forgot-password", forgotPasswordHandler);
router.patch("/set-password", setPasswordHandler);

router.patch("/change-password",authMiddleware, changePasswordHandler);

// Ruta para verificar si el token es válido (Solo para pruebas)
router.post("/verify-user", authMiddleware, (req, res) => {
  res.json({
    message: "Token válido",
    user: req.user,
  });
});


module.exports = router;
