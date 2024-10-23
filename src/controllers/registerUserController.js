const prisma = require("../db.js");
const bcrypt = require("bcrypt");

const registerUserController = async (
  email,
  password,
  name,
  user_type,
  role,
  companyId,
  responseIds,
  resultIds,
  accessIds
) => {
  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      user_type,
      role,
      company: companyId
        ? {
            connect: { company_id: companyId },
          }
        : undefined,
      responses: responseIds
        ? {
            connect: responseIds.map((id) => ({ id })),
          }
        : undefined,
      results: resultIds
        ? {
            connect: resultIds.map((id) => ({ id })),
          }
        : undefined,
      access: accessIds
        ? {
            connect: accessIds.map((id) => ({ id })),
          }
        : undefined,
    },
  });
  return `The User "${name}" was created successfully.`;
};

const hashPassword = async (plainPassword) => {
  const saltRounds = 10; // The cost factor
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

module.exports = {
  registerUserController,
};
