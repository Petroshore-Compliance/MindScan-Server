const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");

const emailCreatedUserScript = async (
  name,
  companyName,
  email,
  htmlPath,
) => {
  const subject = "Welcome to Mindscan";

  const htmlTemplatePath = path.join(__dirname, htmlPath);
  let htmlTemplate;

  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent = htmlTemplate.replace(/{{name}}/g, name);


  await sendEmail(email, subject, htmlContent);

  return `The User with id: "${name}" has been invited to the company with id: "${companyName}"`;
};

module.exports = { emailCreatedUserScript };
