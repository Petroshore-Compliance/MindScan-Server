require("dotenv").config();

const { EMAIL_SENDER, EMAIL_TOKEN } = process.env;

const nodemailer = require("nodemailer");

// Step 5.1: Create a transporter
let transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail'
  auth: {
    user: EMAIL_SENDER, // Your email address
    pass: EMAIL_TOKEN, // Your email account password or app password
  },
});

// Step 5.2: Set up email data
let mailOptions = {
  from: '"Petroshore Compliance"', // Sender address
  to: "roman.delasheras@petroshorecompliance.com", // List of recipients
  subject: "Hello from Nodemailer", // Subject line
  text: "Hello world?", // Plain text body
  html: "<b>Hello world?</b>", // HTML body
};

// Step 5.3: Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error occurred:", error);
  }
  console.log("Email sent:", info.response);
});
