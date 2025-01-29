const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes.js");
const userRoutes = require("./userRoutes.js");
const companiesRoutes = require("./companiesRoutes.js");
const invitationsRoutes = require("./invitationsRoutes.js");
const formRoutes = require("./contactFormRoutes.js");
const adminRoutes = require("./adminRoutes.js");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/companies", companiesRoutes);
router.use("/invitations", invitationsRoutes);
router.use("/contact", formRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
