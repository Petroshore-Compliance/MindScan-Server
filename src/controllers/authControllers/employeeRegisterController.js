const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

const { leaveCompanyController } = require("../usersControllers/leaveCompanyController.js");


const employeeRegisterController = async (data) => {


  const validInvitation = await prisma.companyInvitation.findUnique({
    where: {
      invitation_token: data.token,
    },
  });
  if (!validInvitation || validInvitation.status != "pending") {
    return { status: 410, message: "Invalid invitation" };
  }



  const emailInUse = await prisma.user.findUnique({
    where: {
      email: data.email.toLowerCase(),
    },
  });
  if (emailInUse) {
    return { status: 409, message: "Email already in use" };
  }


  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      password: await bcrypt.hash(data.password, 10),
      role: data.role,
      company_id: data.company_id,
    },
  });

  await prisma.companyInvitation.update({
    where: {
      invitation_token: data.token,
    },
    data: {
      status: "accepted",
    },
  });

  return { status: 201, message: "Employee registered successfully." };
};

module.exports = { employeeRegisterController };
