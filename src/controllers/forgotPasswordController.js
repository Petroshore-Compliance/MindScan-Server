const prisma = require("../db.js");
const sendEmail = require("../tools/nodemailer.js");
const fs = require("fs");
const path = require("path");

const forgotPasswordController = async (email) =>{
  const user = await prisma.User.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

if(!user) return {message: "Email not found."};

const subject = "Reset confirmation";

const htmlTemplatePath = path.join(__dirname, "../templates/resetPassword.html");
let htmlTemplate;

  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  const htmlContent = htmlTemplate.replace(/{{resetURL}}/g, `localhost:4000/reset-password/${user.user_id}}`);

sendEmail(user.email,subject, htmlContent);

return { URL: `localhost:4000/reset-password/${user.user_id}`};
}


module.exports = { forgotPasswordController };