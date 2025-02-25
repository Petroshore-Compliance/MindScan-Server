const prisma = require("../../db.js");



const updateInvitationController = async (data) => {

  const activeInvitation = await prisma.companyInvitation.findFirst({
    where: {
      email: data.guest.toLowerCase(),
      company_id: data.user.company_id,
      status: "pending",
    },
  });


  await prisma.companyInvitation.update({
    where: {
      invitation_token: activeInvitation.invitation_token,
    },
    data: {
      status: "cancelled",
    },
  });


  return { status: 201, message: "Invitation cancelled successfully" };
};

module.exports = { updateInvitationController };
