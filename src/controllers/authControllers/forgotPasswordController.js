const fs = require("fs");
const path = require("path");

const jwt = require("jsonwebtoken");


const prisma = require("../../db.js");
const sendEmail = require("../../tools/nodemailer.js");

const forgotPasswordController = async (email) => {
  const user = await prisma.User.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!user) return { status: 404, message: "Email not found." };

  //setup para enviar el email

  const token = jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      role: user.role,
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

  sendEmail(user.email, subject, htmlContent);

  return { status: 200, URL: `localhost:4000/reset-password` };
};

module.exports = { forgotPasswordController };
