const prisma = require("../../db.js");


const jwt = require("jsonwebtoken");
const { encryptJWT } = require("../../tools/auth.js");


const getInvitationController = async (data) => {

  if (data.invitation_id) {
    const invitation = await prisma.companyInvitation.findUnique({
      where: {
        invitation_id: data.invitation_id,
        company_id: data.user.company_id,
      },
      select: {
        invitation_id: true,
        email: true,
        user_id: false,
        invitation_token: false,
        company_id: false,
        status: true,
        created_at: true,
        updated_at: false,
        user: false,
        company: false
      },
    });
    if (!invitation) {
      return { status: 404, message: "Invitation not found" };
    }
    const formattedInvitation = {
      ...invitation,
      created_at: new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(invitation.created_at)),
    };
    return { status: 200, message: "Invitation found", invitation: formattedInvitation };
  } else {
    const invitation = await prisma.companyInvitation.findMany({
      orderBy: { created_at: "desc" },
      where: {
        company_id: data.user.company_id,
      },
      select: {
        invitation_id: true,
        email: true,
        user_id: false,
        invitation_token: false,
        company_id: false,
        status: true,
        created_at: true,
        updated_at: false,
        user: false,
        company: false
      },
    });

    if (!invitation) {
      return { status: 404, message: "No invitations found" };
    }

    const formattedInvitations = invitation.map(inv => ({
      ...inv,
      created_at: new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(new Date(inv.created_at))
    }));
    return { status: 200, message: "Invitation found", invitation: formattedInvitations };
  }


};

module.exports = { getInvitationController };
