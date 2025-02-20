const prisma = require("../../db.js");
const { emailLeaveCompanyScript } = require("../../tools/emailLeaveCompanyScript.js");


const leaveCompanyController = async (userID) => {
  const userBeforeUpdate = await prisma.user.findUnique({
    where: { user_id: userID },
    select: {
      name: true,
      email: true,
      company: {
        select: { email: true, name: true },
      },
    },
  });


  if (!userBeforeUpdate) {
    return { status: 404, message: "User not found" };
  }
  if (!userBeforeUpdate.company) {
    return { status: 400, message: "User is not part of a company" };
  }


  const user = await prisma.user.update({
    where: { user_id: userID },
    data: { company_id: null },
  });




  await emailLeaveCompanyScript(
    userBeforeUpdate.name,
    userBeforeUpdate.email,
    userBeforeUpdate.company.name,
    userBeforeUpdate.company.email,
  );

  return { status: 200, message: "User left company successfully", user: user };
};

module.exports = { leaveCompanyController };