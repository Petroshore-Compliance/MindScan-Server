const fs = require("fs");
const path = require("path");
const sendEmail = require("./nodemailer.js");
const juice = require("juice");

const prisma = require("../db.js");
const e = require("cors");

const emailContactFormCreatedScript = async (
  formName,
  formEmail,
  formPhone,
  formLanguage,
  formMessage,
  htmlPath
) => {
  const subject = "Mindscan - New Contact Form";

  const htmlTemplatePath = path.join(__dirname, htmlPath);
  let htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  let language;
  switch (formLanguage) {
    case "es":
      language = "spanish";
      break;
    case "pt":
      language = "portuguese";
      break;
    default:
      language = "english";
  }

  const htmlContent = htmlTemplate
    .replace(/{{Name}}/g, formName)
    .replace(/{{language}}/g, language)
    .replace(/{{message}}/g, formMessage)
    .replace(/{{phone}}/g, formPhone)
    .replace(/{{email}}/g, formEmail);

  const globalCSS = fs.readFileSync(path.join(__dirname, "../styles/global.css"), "utf-8");

  const inlinedHtml = juice.inlineContent(htmlContent, globalCSS);

  const emailReceivers = await prisma.petroAdmin.findMany({
    where: {
      notifications: true,
    },
  });

  for (const receiver of emailReceivers) {
    await sendEmail(receiver.email, subject, inlinedHtml);
  }

  return "Contact form notification email sent successfully.";
};

module.exports = { emailContactFormCreatedScript };
