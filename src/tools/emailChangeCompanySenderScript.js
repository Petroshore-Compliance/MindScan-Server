const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");
const juice = require("juice");

const emailChangeCompanySenderScript = async (
  id_to_link,
  emailToVerify,
  htmlPath,
  companyName,
  verificationToken
) => {
  const subject = "Invited to another company";

  const htmlTemplatePath = path.join(__dirname, htmlPath);
  let htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent = htmlTemplate
    .replace(/{{changeCompanyURL}}/g, "localhost:400/pestañaDondePonerElToken")
    .replace(/{{verificationCode}}/g, verificationToken)
    .replace(/{{company}}/g, companyName ? companyName : "Petroshore Compliance");

  const globalCSS = fs.readFileSync(path.join(__dirname, "../public/styles/global.css"), "utf8");

  const inlinedhtml = juice.inlineContent(htmlContent, globalCSS);

  sendEmail(emailToVerify, subject, inlinedhtml);

  return `The User with id: "${id_to_link}" now has a token to join "${companyName}. The code is: ${verificationToken}`;
};

module.exports = { emailChangeCompanySenderScript };
