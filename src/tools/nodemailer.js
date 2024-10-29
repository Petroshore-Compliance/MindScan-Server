require("dotenv").config();

const nodemailer = require("nodemailer");

const { EMAIL_SENDER, EMAIL_TOKEN } = process.env;

if (!EMAIL_SENDER || !EMAIL_TOKEN) {
  console.error("Error: Missing required environment variables. Please set EMAIL_SENDER and EMAIL_TOKEN in your .env file.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_TOKEN,
  },
});

async function sendVerificationEmail(recipientEmail,subject, htmlContent) {
  if (!recipientEmail) {
    throw new Error("Recipient email is required.");
  }

  const mailOptions = {
    from: `"Petroshore Compliance" <${EMAIL_SENDER}>`, 
    to: recipientEmail, 
    subject: subject, // Subject line
    text: ``, // Plain text body
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
