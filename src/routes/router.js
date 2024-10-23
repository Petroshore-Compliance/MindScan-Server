const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes.js");

router.use("/", authRoutes);

module.exports = router;
