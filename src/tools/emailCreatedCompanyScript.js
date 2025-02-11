const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");
const juice = require("juice");

const emailCreatedCompanyScript = async (
  email,
  name,
  companyName,
  companyEmail,
  htmlPath,
) => {

  const subject = "Welcome to Mindscan";

  const htmlTemplatePath = path.join(__dirname, htmlPath);
  const htmlAdminTemplatePath = path.join(__dirname, "../templates/createdCompanyAdminEmail.html");

  let htmlCompanyTemplate = fs.readFileSync(htmlTemplatePath, "utf8");
  let htmlAdminTemplate = fs.readFileSync(htmlAdminTemplatePath, "utf8");

  const htmlCompanyContent = htmlCompanyTemplate
  .replace(/{{name}}/g, name)
  .replace(/{{companyName}}/g, companyName)
  .replace(/{{email}}/g, email)
  .replace(/{{companyEmail}}/g, companyEmail);

  const htmlAdminContent = htmlAdminTemplate
  .replace(/{{name}}/g, name)
  .replace(/{{companyName}}/g, companyName)
  .replace(/{{email}}/g, email);

  const globalCSS = fs.readFileSync(path.join(__dirname,"../styles/global.css"), "utf8");

  const inlinedCompanyHtml = juice.inlineContent(htmlCompanyContent, globalCSS);
  const inlinedAdminhtml = juice.inlineContent(htmlAdminContent, globalCSS);

  await sendEmail(email, subject, inlinedAdminhtml);
  await sendEmail(companyEmail, subject, inlinedCompanyHtml);

  return `The User with id: "${name}" has been invited to the company with id: "${companyName}"`;
};

module.exports = { emailCreatedCompanyScript };
