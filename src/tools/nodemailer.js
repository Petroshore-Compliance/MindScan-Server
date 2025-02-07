require("dotenv").config();

const nodemailer = require("nodemailer");

const { EMAIL_SENDER, EMAIL_TOKEN } = process.env;

if (!EMAIL_SENDER || !EMAIL_TOKEN) {
  console.error(
    "Error: Missing required environment variables. Please set EMAIL_SENDER and EMAIL_TOKEN in your .env file."
  );
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_TOKEN,
  },
});

// este método se encarga de enviar el email
// recibe como parámetros el email del destinatario, el asunto y el contenido del email()
// y devuelve un objeto con la respuesta del envío del email

async function sendEmail(recipientEmail, subject, htmlContent) {
  //estas dos líneas "simulan" el envío de un email

  console.log("Email sending skipped in test environment (nodemailer.js)");
  //return { success: true, info: "Test environment - email not sent." };

  if (!recipientEmail) {
    throw new Error("Recipient email is required.");
  }

  const mailOptions = {
    from: `"Petroshore Compliance" <${EMAIL_SENDER}>`,
    to: recipientEmail,
    subject: subject,
    text: ``,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info: info.response };
  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    throw new Error("Failed to send email.");
  }
}

module.exports = sendEmail;
