const jwt = require("jsonwebtoken");
const { decryptJWT } = require("../../tools/auth.js");
const prisma = require("../../db.js");
const { leaveCompanyController } = require("../../controllers/usersControllers/leaveCompanyController.js");


const companyChangeController = async (data) => {
  const decryptedData = await decryptJWT(data.token);
  const decoded = jwt.verify(decryptedData.token, process.env.JWT_SECRET);

  const userFound = await prisma.user.findUnique({
    where: { email: data.user.email },
  });

  if (decoded.email !== userFound.email) {
    return { status: 403, message: "You are not authorized to change company" };
  }

  if (decoded.company_id == userFound.company_id) {
    return { status: 409, message: "You are already in this company" };
  }

  const user = await prisma.user.findUnique({
    where: { email: decoded.email },
  });

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  await leaveCompanyController(userFound.user_id);


  await prisma.user.update({
    where: { user_id: user.user_id },
    data: { company_id: decoded.company_id },
  });

  await prisma.companyInvitation.update({
    where: {
      invitation_token: data.token,
    },
    data: {
      status: "accepted",
    },
  });

  return { status: 200, message: "Company changed successfully" };


};

module.exports = { companyChangeController };