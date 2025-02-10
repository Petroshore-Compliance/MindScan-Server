const fs = require("fs");
const path = require("path");

const jwt = require("jsonwebtoken");

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

  const token = jwt.sign(
    {
      id: petroAdmin.petroAdmin_id,
      email: petroAdmin.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    }
  );


  const subject = "Reset confirmation";

  const htmlTemplatePath = path.join(__dirname, "../../templates/resetPassword.html");
  let htmlTemplate;

  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent = htmlTemplate.replace(/{{resetURL}}/g, `localhost:5173/set-password?token=${token}`);

  sendEmail(petroAdmin.email, subject, htmlContent);

  return { status: 200, URL: `localhost:4000/admin/reset-password` };
};

module.exports = { forgotPasswordAdminController };
