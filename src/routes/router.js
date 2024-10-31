const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const authRoutes = require("./authRoutes.js");
const userRoutes = require("./userRoutes.js");

router.use("/auth", authRoutes);
router.use("/users",authMiddleware, userRoutes);

module.exports = router;