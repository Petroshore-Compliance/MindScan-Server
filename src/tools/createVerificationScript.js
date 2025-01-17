const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");

// Checks if an email already has an open contact request
const createVerificationScript = async (contactFormState) => {
  const statusCodes = {
    new: { status: 409, reason: "already new" },
    inProgress: { status: 423, reason: "inProgress" },
    accepted: null,
    rejected: null,
  };

  return statusCodes[contactFormState] || undefined;
};

module.exports = { createVerificationScript };