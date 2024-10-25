const { Router } = require("express");
const router = Router();

const { registerUserMiddleware } = require("../middlewares/putUserMiddleware.js");
const { registerUserHandler } = require("../handlers/registerUserHandler.js");
const { loginUserHandler } = require("../handlers/loginUserHandler.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { changePasswordHandler } = require("../handlers/changePasswordHandler.js");

router.post("/register", registerUserMiddleware, registerUserHandler);
router.post("/login", loginUserHandler);

router.patch("/change-password", changePasswordHandler);

// Ruta para verificar si el token es válido (Solo para pruebas)
router.post("/verify-user", authMiddleware, (req, res) => {
  res.json({
    message: "Token válido",
    user: req.user,
  });
});


module.exports = router;
