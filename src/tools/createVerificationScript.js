const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");


const createVerificationScript = async (id_to_link, emailToVerify, htmlPath,companyName) => {
  const newCode = 1000 + Math.floor(Math.random() * 9000);
   await prisma.VerificationCode.create({
    data: {
      user_id: id_to_link,
      code: newCode,
    },
  }
);
const subject = "Verification code";

const htmlTemplatePath = path.join(__dirname, htmlPath);
let htmlTemplate;


  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent2 = htmlTemplate.replace(/{{verificationCode}}/g, newCode);
  const htmlContent = htmlContent2.replace(/{{company}}/g,companyName? companyName : "Petroshore Compliance");


sendEmail(emailToVerify,subject, htmlContent);

  return `The User with id: "${id_to_link}" now has a verification code and an email sent to verify it. The code is: ${newCode}`;
};

module.exports = { createVerificationScript };
