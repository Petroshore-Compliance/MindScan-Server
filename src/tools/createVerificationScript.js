const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");


const createVerificationScript = async (id_to_link, emailToVerify) => {
  const newCode = Math.floor(Math.random() * 10000);
   await prisma.VerificationCode.create({
    data: {
      user_id: id_to_link,
      code: newCode,
    },
  }
);
const subject = "Verification code";

const htmlTemplatePath = path.join(__dirname, "../templates/verificationEmail.html");
let htmlTemplate;


  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent = htmlTemplate.replace(/{{verificationCode}}/g, newCode);


sendEmail(emailToVerify,subject, htmlContent);

  return `The User with id: "${id_to_link}" now has a verification code and an email sent to verify it. The code is: ${newCode}`;
};

module.exports = { createVerificationScript };
