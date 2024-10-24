const prisma = require("../db.js");
const bcrypt = require("bcrypt");
const {
  createVerificationScript,
} = require("../tools/createVerificationScript.js");

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

  createVerificationScript(newUser.user_id);

  return `The User "${name}" was created successfully.`;
};

module.exports = {
  registerUserController,
};
