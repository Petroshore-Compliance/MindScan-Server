const prisma = require("../../db.js");

const { leaveCompanyController } = require("../../controllers/usersControllers/leaveCompanyController.js");

const employeeReleaseController = async (data) => {

  const userFound = await prisma.user.findUnique({
    where: {
      email: data.email,
      company_id: data.user.company_id,
    },
  });
  if (!userFound) {
    return { status: 404, message: "User not a part of the company" };
  } else {

    await leaveCompanyController(userFound.user_id);

  }

  return { status: 200, message: "Employee released" };
};

module.exports = { employeeReleaseController };
