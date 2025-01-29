const fs = require("fs");
const path = require("path");
const sendEmail = require("./nodemailer.js");

const prisma = require("../db.js");

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

  htmlTemplate = htmlTemplate
    .replace(/{{Name}}/g, formName)
    .replace(/{{language}}/g, formLanguage)
    .replace(/{{message}}/g, formMessage)
    .replace(/{{phone}}/g, formPhone)
    .replace(/{{email}}/g, formEmail);

  const emailReceivers = await prisma.petroAdmin.findMany({
    where: {
      notifications: true,
    },
  });

  for (const receiver of emailReceivers) {
    await sendEmail(receiver.email, subject, htmlTemplate);
  }


  return "Contact form notification email sent successfully.";
};

module.exports = { emailContactFormCreatedScript };