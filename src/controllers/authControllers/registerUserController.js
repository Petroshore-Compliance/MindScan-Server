const bcrypt = require("bcrypt");

const prisma = require("../../db.js");
const { createVerificationScript } = require("../../tools/createVerificationScript.js");

const registerUserController = async (
  email,
  password,
  name,
  user_type,
  role,
  companyId
) => {

  companyId = user_type === 'individual' ? null : companyId;

  const emailInUse = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (emailInUse) {
    return {status: 400, message: 'Email already in use'};
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: password ? await bcrypt.hash(password, 10) : null,
      user_type,
      role,
      company: companyId
        ? {
            connect: { company_id: companyId },
          }
        : undefined,
    },
  });

  createVerificationScript(newUser.user_id, newUser.email,"../templates/verificationEmail.html");

  return {status: 204, message: 'User registered successfully', user: newUser};
};

module.exports = {
  registerUserController,
};
