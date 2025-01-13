const fs = require("fs");
const path = require("path");

const prisma = require("../../db.js");
const sendEmail = require("../../tools/nodemailer.js");

const deleteAdminController = async (userID) => {
  
}

module.exports = { deleteAdminController };