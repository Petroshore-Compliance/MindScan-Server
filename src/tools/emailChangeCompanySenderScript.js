const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");

const emailChangeCompanySenderScript = async (
  id_to_link,
  emailToVerify,
  htmlPath,
  companyName,
  verificationToken
) => {
  const subject = "Invited to another company";

  const htmlTemplatePath = path.join(__dirname, htmlPath);
  let htmlTemplate;

  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent3 = htmlTemplate.replace(
    /{{changeCompanyURL}}/g,
    "localhost:400/pestañaDondePonerElToken"
  );
  const htmlContent2 = htmlContent3.replace(/{{verificationCode}}/g, verificationToken);
  const htmlContent = htmlContent2.replace(
    /{{company}}/g,
    companyName ? companyName : "Petroshore Compliance"
  );

  sendEmail(emailToVerify, subject, htmlContent);

  return `The User with id: "${id_to_link}" now has a token to join "${companyName}. The code is: ${verificationToken}`;
};

module.exports = { emailChangeCompanySenderScript };
