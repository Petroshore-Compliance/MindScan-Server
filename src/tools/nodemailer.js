const nodemailer = require("nodemailer");

// Step 5.1: Create a transporter
let transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail'
  auth: {
    user: "roman.delasheras@petroshorecompliance.com", // Your email address
    pass: "yrbn hkmr olbe uddm", // Your email account password or app password
  },
});

// Step 5.2: Set up email data
let mailOptions = {
  from: '"Your Name" <roman.delasheras@petroshorecompliance.com>', // Sender address
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
