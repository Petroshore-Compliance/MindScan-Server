const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");
const juice = require("juice");

const emailCreateNewUserScript = async (
  emailToVerify,
  htmlPath,
  name,
  verificationToken
) => {
  const subject = "You have been invited to join a company";

  const htmlTemplatePath = path.join(__dirname, htmlPath);
  
  let htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent = htmlTemplate
  .replace(/{{joinCompanyURL}}/g, "localhost:400/pestañaDonderegistrarse")
  .replace(/{{newAccountToken}}/g, verificationToken)
  .replace(/{{company}}/g, name ? name : "Petroshore Compliance");

  //Obtener css
  const globalCSS = fs.readFileSync(path.join(__dirname, "../styles/global.css"), "utf-8");
  
  // Aplicar Juice para estilos inline (SIN modificar la plantilla original)
  const inlinedHtml = juice.inlineContent(htmlContent, globalCSS);

  await sendEmail(emailToVerify, subject, inlinedHtml);

  return `User invited succesfully`;
};

module.exports = { emailCreateNewUserScript };
