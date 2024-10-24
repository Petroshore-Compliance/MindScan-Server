const prisma = require("../db.js");

const createVerificationScript = async (id_to_link) => {
  const newVerificationCode = await prisma.VerificationCode.create({
    data: {
      user_id: id_to_link,
      code: Math.floor(Math.random() * 10000),
    },
  });
  return `The User with id: "${id_to_link}" now has a verification code.`;
};

module.exports = { createVerificationScript };
