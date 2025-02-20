const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");
const juice = require("juice");


const emailLeaveCompanyScript = async (
  employeeName,
  employeeEmail,
  companyName,
  companyEmail,
) => {
  let subject = "Unlinked from " + companyName;

  let htmlPath = "../templates/emailCompanyExit.html"


  let htmlTemplatePath = path.join(__dirname, htmlPath);

  let htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  let htmlContent = htmlTemplate
    .replace(/{{employeeName}}/g, employeeName)
    .replace(/{{companyName}}/g, companyName)
    .replace(/{{employeeEmail}}/g, employeeEmail)
    .replace(/{{companyEmail}}/g, companyEmail);


  //Obtener css
  let globalCSS = fs.readFileSync(path.join(__dirname, "../styles/global.css"), "utf-8");

  // Aplicar Juice para estilos inline (SIN modificar la plantilla original)
  let inlinedHtml = juice.inlineContent(htmlContent, globalCSS);

  await sendEmail(companyEmail, subject, inlinedHtml);




  subject = employeeName + " unlinked from " + companyName;

  htmlPath = "../templates/emailEmployeeExit.html"


  htmlTemplatePath = path.join(__dirname, htmlPath);

  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  htmlContent = htmlTemplate
    .replace(/{{employeeName}}/g, employeeName)
    .replace(/{{companyName}}/g, companyName)
    .replace(/{{employeeEmail}}/g, employeeEmail)
    .replace(/{{companyEmail}}/g, companyEmail);


  //Obtener css
  globalCSS = fs.readFileSync(path.join(__dirname, "../styles/global.css"), "utf-8");

  // Aplicar Juice para estilos inline (SIN modificar la plantilla original)
  inlinedHtml = juice.inlineContent(htmlContent, globalCSS);

  await sendEmail(employeeEmail, subject, inlinedHtml);












  return `The User with id: "${employeeName}" has left the company: "${companyName}"`;
};

module.exports = { emailLeaveCompanyScript };
