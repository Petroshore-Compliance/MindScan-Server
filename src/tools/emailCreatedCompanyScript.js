const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");

const emailCreatedCompanyScript = async (
  email,
  name,
  companyName,
  companyEmail,
  htmlPath,
) => {

  console.log("email", email);
  const subject = "Welcome to Mindscan";

  const htmlTemplatePath = path.join(__dirname, htmlPath);
  let htmlTemplate;

  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent = htmlTemplate.replace(/{{name}}/g, name).replace(/{{companyName}}/g, companyName).replace(/{{email}}/g, email).replace(/{{companyEmail}}/g, companyEmail);


  await sendEmail(email, subject, htmlContent);
  await sendEmail(companyEmail, subject, htmlContent);


  return `The User with id: "${name}" has been invited to the company with id: "${companyName}"`;
};

module.exports = { emailCreatedCompanyScript };
