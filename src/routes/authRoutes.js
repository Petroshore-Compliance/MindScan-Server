const { Router } = require("express");
const router = Router();
const { registerUserHandler } = require("../handlers/registerUserHandler.js");

const {
  registerUserMiddleware,
} = require("../middlewares/putUserMiddleware.js");

router.post("/register", registerUserMiddleware, registerUserHandler);

module.exports = router;
