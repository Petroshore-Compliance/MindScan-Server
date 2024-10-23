const prisma = require("../db.js");

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
      email,
      password,
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

module.exports = {
  registerUserController,
};
