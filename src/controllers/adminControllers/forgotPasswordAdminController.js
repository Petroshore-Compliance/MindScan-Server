const fs = require("fs");
const path = require("path");

const prisma = require("../../db.js");
const sendEmail = require("../../tools/nodemailer.js");

const forgotPasswordAdminController = async (email) => {
  const petroAdmin = await prisma.petroAdmin.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!petroAdmin) return { status: 404, message: "Email not found." };

  //setup para enviar el email

  const subject = "Reset confirmation";

  const htmlTemplatePath = path.join(__dirname, "../../templates/resetPassword.html");
  let htmlTemplate;

  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent = htmlTemplate.replace(/{{resetURL}}/g, `localhost:4000/admin/reset-password`);

  sendEmail(petroAdmin.email, subject, htmlContent);

  return { status: 200, URL: `localhost:4000/admin/reset-password` };
};

module.exports = { forgotPasswordAdminController };
