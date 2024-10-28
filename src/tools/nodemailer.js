require("dotenv").config();
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const { EMAIL_SENDER, EMAIL_TOKEN } = process.env;

if (!EMAIL_SENDER || !EMAIL_TOKEN) {
  console.error("Error: Missing required environment variables. Please set EMAIL_SENDER and EMAIL_TOKEN in your .env file.");
  process.exit(1);
}

// Step 1: Read the HTML template
const htmlTemplatePath = path.join(__dirname, "../templates/verificationEmail.html");
let htmlTemplate;

try {
  htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");
} catch (error) {
  console.error("Error reading HTML template:", error.message);
  process.exit(1);
}

// Step 5.1: Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_TOKEN,
  },
});

// Function to send email
async function sendVerificationEmail(recipientEmail, verificationCode) {
  if (!recipientEmail) {
    throw new Error("Recipient email is required.");
  }

  if (!verificationCode) {
    throw new Error("Verification code is required.");
  }

  // Replace the placeholder in the HTML template with the actual verification code
  const htmlContent = htmlTemplate.replace(/{{verificationCode}}/g, verificationCode);

  // Step 5.2: Set up email data
  const mailOptions = {
    from: `"Petroshore Compliance" <${EMAIL_SENDER}>`, // Sender address with name
    to: recipientEmail, // Recipient address passed as an argument
    subject: "Verification Code from Petroshore Compliance", // Subject line
    text: `Your verification code is: ${verificationCode}`, // Plain text body
    html: htmlContent, // HTML body
  };

  // Step 5.3: Send the email using async/await
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, info: info.response };
  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    throw new Error("Failed to send email.");
  }
}

// Export the function so it can be used in other modules
module.exports = sendVerificationEmail;
