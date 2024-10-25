const prisma = require("../db.js");
const bcrypt = require("bcrypt");
const { createVerificationScript } = require("../tools/createVerificationScript.js");

const registerUserController = async (
  email,
  password,
  name,
  user_type,
  role,
  companyId
) => {
  const emailInUse = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (emailInUse) {
    return false;
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      user_type,
      role,
      company: companyId
        ? {
            connect: { company_id: companyId },
          }
        : undefined,
    },
  });

  createVerificationScript(newUser.user_id);

  return true;
};

module.exports = {
  registerUserController,
};
