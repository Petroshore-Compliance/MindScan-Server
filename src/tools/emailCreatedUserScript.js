const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");
const juice = require("juice");


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

  const htmlContent = htmlTemplate
  .replace(/{{name}}/g, name)
  .replace(/{{HOMEPAGEURL}}/g, process.env.HOMEPAGEURL);

  //Obtener css
  const globalCSS = fs.readFileSync(path.join(__dirname, "../styles/global.css"), "utf-8");
  
  // Aplicar Juice para estilos inline (SIN modificar la plantilla original)
  const inlinedHtml = juice.inlineContent(htmlContent, globalCSS);

  await sendEmail(email, subject, inlinedHtml);

  return `The User with id: "${name}" has been invited to the company with id: "${companyName}"`;
};

module.exports = { emailCreatedUserScript };
