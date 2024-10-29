const prisma = require("../db.js");
const sendVerificationEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");


const createVerificationScript = async (id_to_link, emailToVerify) => {
  const newCode = Math.floor(Math.random() * 10000);
  const newVerificationCode = await prisma.VerificationCode.create({
    data: {
      user_id: id_to_link,
      code: newCode,
    },
  }
);
const subject = "Verification code";

// Step 1: Read the HTML template
const htmlTemplatePath = path.join(__dirname, "../templates/verificationEmail.html");
let htmlTemplate;

try {
  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");
} catch (error) {
  console.error("Error reading HTML template:", error.message);
  process.exit(1);
}
  // Replace the placeholder in the HTML template with the actual verification code
  const htmlContent = htmlTemplate.replace(/{{verificationCode}}/g, newCode);


sendVerificationEmail(emailToVerify,subject, htmlContent);
  return `The User with id: "${id_to_link}" now has a verification code and an email sent to verify it. The code is: ${newCode}`;
};

module.exports = { createVerificationScript };
