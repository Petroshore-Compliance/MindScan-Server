const fs = require("fs");
const path = require("path");

const jwt = require("jsonwebtoken");
const { encryptJWT } = require("../../tools/auth.js");

const prisma = require("../../db.js");
const sendEmail = require("../../tools/nodemailer.js");
const juice = require("juice");

const forgotPasswordController = async (email) => {
  const user = await prisma.User.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!user) return { status: 404, message: "Email not found." };

  //setup para enviar el email

  const JWTtoken = jwt.sign(
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

  const token = await encryptJWT(JWTtoken);

  const subject = "Reset confirmation";

  const htmlTemplatePath = path.join(__dirname, "../../templates/resetPassword.html");
  let htmlTemplate;

  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent = htmlTemplate.replace(
    /{{resetURL}}/g,
    `localhost:5173/set-password?token=${token}`
  );

  const globalCSS = fs.readFileSync(path.join(__dirname, "../../styles/global.css"), "utf8");

  const inlinedhtml = juice.inlineContent(htmlContent, globalCSS);

  sendEmail(user.email, subject, inlinedhtml);

  return { status: 200, URL: `localhost:5173/set-password?token=${token}` };
};

module.exports = { forgotPasswordController };
