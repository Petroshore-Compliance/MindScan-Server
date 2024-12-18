const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { registerUserMiddleware } = require("../middlewares/authMiddlewares/putUserMiddleware.js");
const {changePasswordMiddleware} = require("../middlewares/authMiddlewares/changePasswordMiddleware.js");
const { forgotPasswordMiddleware } = require("../middlewares/authMiddlewares/forgotPasswordMiddleware.js");
const { loginUserMiddleware } = require("../middlewares/authMiddlewares/loginUserMiddleware.js");
const { setPasswordMiddleware } = require("../middlewares/authMiddlewares/setPasswordMiddleware.js");
const { verificateUserMiddleware } = require("../middlewares/authMiddlewares/verificateUserMiddleware.js");

const { changePasswordHandler } = require("../handlers/authHandlers/changePasswordHandler.js");
const { forgotPasswordHandler } = require("../handlers/authHandlers/forgotPasswordHandler.js");
const { loginUserHandler } = require("../handlers/authHandlers/loginUserHandler.js");
const { registerUserHandler } = require("../handlers/authHandlers/registerUserHandler.js");
const { setPasswordHandler } = require("../handlers/authHandlers/setPasswordHandler.js");
const { verificateUserHandler } = require("../handlers/authHandlers/verificateUserHandler.js");

router.post("/register", registerUserMiddleware, registerUserHandler);
router.post("/login", loginUserMiddleware,loginUserHandler);
//router.get("/verificate-user", verificateUserMiddleware,verificateUserHandler);
router.get("/forgot-password", forgotPasswordMiddleware,forgotPasswordHandler);
router.patch("/set-password",setPasswordMiddleware, setPasswordHandler);

router.patch("/change-password",authMiddleware, changePasswordMiddleware,changePasswordHandler);



// Ruta para verificar si el token es válido (Solo para pruebas)
router.post("/verify-user", authMiddleware, (req, res) => {
  res.json({
    message: "Token válido",
    user: req.user,
  });
});

module.exports = router;
