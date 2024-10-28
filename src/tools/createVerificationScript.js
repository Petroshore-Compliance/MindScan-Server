const prisma = require("../db.js");
const sendVerificationEmail = require("./nodemailer.js");

const createVerificationScript = async (id_to_link, emailToVerify) => {
  const newCode = Math.floor(Math.random() * 10000);
  const newVerificationCode = await prisma.VerificationCode.create({
    data: {
      user_id: id_to_link,
      code: newCode,
    },

  }
);

sendVerificationEmail(emailToVerify,newCode);
  return `The User with id: "${id_to_link}" now has a verification code and an email sent to verify it. The code is: ${newCode}`;
};

module.exports = { createVerificationScript };
