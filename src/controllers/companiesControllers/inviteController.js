const prisma = require("../../db");

const { emailChangeCompanySenderScript } = require("../../tools/emailChangeCompanySenderScript.js");
const { emailCreateNewUserScript } = require("../../tools/emailCreateNewUserScript.js");

const {
  createInvitationController,
} = require("../../controllers/invitationsControllers/createInvitationController.js");

// crea una invitación para el usuario y envia un email
//recibe guest, role, company_id
const inviteController = async (data) => {
  let isNew = false;


  const company = await prisma.company.findUnique({
    where: {
      company_id: data.user.company_id,
    },
    include: {
      invitations: true,
    },
  });



  const user = await prisma.user.findUnique({
    where: {
      email: data.guest.toLowerCase(),
    },
  });

  if (!company) {
    return { status: 404, message: "Company not found" };
  }

  //comprobar si hay espacio disponible para invitar
  const availableLicenses = company.licenses - company.invitations.length;

  if (availableLicenses < 1) {
    return { status: 402, message: "Not enough licenses" };
  }

  if (!user) {
    isNew = true;
  } else {
    //Comprobar si es necesario invitar
    if (user.company_id == parseInt(company.company_id)) {
      return { status: 409, message: "This user is already part of this company" };
    }
    if (user.role == "admin") {
      if (company.company_id == user.company_id) {
        return { status: 409, message: "This user is the administrator of this company." };
      } else {
        return {
          status: 403,
          message:
            "This user is the administrator of a company, you cant invite him to another company",
        };
      }
    }

    // comprobar si hay invitaciones activas
    const activeInvitation = await prisma.companyInvitation.findFirst({
      where: {
        email: data.guest.toLowerCase(),
        company_id: parseInt(company.company_id),
        status: "pending",
      },
    });

    if (activeInvitation) {
      return { status: 423, message: "This Guest email already has a pending invitation" };
    }

    // No hay invitaciones activas, comprobar si hay invitaciones recientes
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentInvitation = await prisma.companyInvitation.findFirst({
      where: {
        email: data.guest.toLowerCase(),
        company_id: parseInt(company.company_id),
        created_at: { gte: oneHourAgo },
      },
    });

    if (recentInvitation) {
      return {
        status: 429,
        message: "Guest email invited within hour",
      };
    }

    // Se ha comprobado que si es necesario crear una invitación

    const response = await createInvitationController(data, company.name);
    return { status: response.status, message: response.message, invitation: response.invitation };
  }


  let alreadyInvited = await prisma.companyInvitation.findMany({
    where: {
      email: data.guest.toLowerCase(),
      company_id: parseInt(company.company_id),
    },
  });

  if (alreadyInvited.length !== 0) {
    return { status: 400, message: `This Guest email already has a pending invitation` };
  }

  const response = await createInvitationController(data, company.name);

  //send email 
  if (isNew) {
    emailCreateNewUserScript(
      data.guest,
      "../templates/invitationEmailNewAccount.html",
      company.name,
      response.invitation.invitation_token
    );
  } else {
    emailChangeCompanySenderScript(
      user.user_id,
      user.guest,
      "../templates/invitationEmailExistingAccount.html",
      company.name,
      response.invitation.invitation_token
    );
  }
  return { status: response.status, message: response.message, invitation: response.invitation };
};

module.exports = { inviteController };
