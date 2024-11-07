const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const authRoutes = require("./authRoutes.js");
const userRoutes = require("./userRoutes.js");
const companiesRoutes = require("./companiesRoutes.js");
const invitationsRoutes = require("./invitationsRoutes.js");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/companies", companiesRoutes);
router.use("/invitations", invitationsRoutes);

module.exports = router;