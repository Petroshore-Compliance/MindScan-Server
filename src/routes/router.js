const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const authRoutes = require("./authRoutes.js");
const userRoutes = require("./userRoutes.js");
const companiesRoutes = require("./companiesRoutes.js");

router.use("/auth", authRoutes);
router.use("/users",authMiddleware, userRoutes);
router.use("/companies", companiesRoutes);

module.exports = router;