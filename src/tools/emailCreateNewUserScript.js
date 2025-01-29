const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");

const emailCreateNewUserScript = async (
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
    /{{joinCompanyURL}}/g,
    "localhost:400/pestañaDonderegistrarse"
  );
  const htmlContent2 = htmlContent3.replace(/{{newAccountToken}}/g, verificationToken);
  const htmlContent = htmlContent2.replace(
    /{{company}}/g,
    companyName ? companyName : "Petroshore Compliance"
  );

  sendEmail(emailToVerify, subject, htmlContent);

  return `User invited succesfully`;
};

module.exports = { emailCreateNewUserScript };
