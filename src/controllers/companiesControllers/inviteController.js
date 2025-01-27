const prisma = require("../../db");

const { emailChangeCompanySenderScript } = require("../../tools/emailChangeCompanySenderScript.js");
const { emailCreateNewUserScript } = require("../../tools/emailCreateNewUserScript.js");

const { createInvitationController } = require("../../controllers/invitationsControllers/createInvitationController.js");

// crea una invitación para el usuario y envia un email
//recibe guest, role, company_id
const inviteController = async (data) => {

  let isNew = false;

  const company = await prisma.company.findUnique({
    where: {
      company_id: data.company_id,
    },
    include: {
      invitations: true
    }
  });


  const user = await prisma.user.findUnique({
    where: {
      email: data.guest.toLowerCase(),
    },
  });


  if (!company) {
    return { status: 404, message: "Company not found" };
  }
  if (!user) {

    isNew = true;


  } else { //Comprobar si es necesario invitar
    if (user.role == 'admin') {
      if (company.company_id == user.company_id) {
        return { status: 409, message: "This user is the administrator of this company." };
      } else {
        return { status: 403, message: "This user is the administrator of a company, you cant invite him to another company" };
      }
    }
    if (user.company_id == parseInt(company.company_id)) {
      return { status: 409, message: "This user is already part of this company" };
    }
    // Check if there's any active (pending) invitation
    const activeInvitation = await prisma.companyInvitation.findFirst({
      where: {
        email: data.guest.toLowerCase(),
        company_id: parseInt(company.company_id),
        // Adjust this condition based on how you define 'active'
        status: 'pending'
      },
    });

    if (activeInvitation) {
      return { status: 423, message: "This Guest email already has a pending invitation" };
    }

    // No active invitations, now check if any invitation was created in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentInvitation = await prisma.companyInvitation.findFirst({
      where: {
        email: data.guest.toLowerCase(),
        company_id: parseInt(company.company_id),
        created_at: { gte: oneHourAgo }
        // No status filter here, we consider all statuses.
      },
    });

    if (recentInvitation) {
      return {
        status: 429,
        message: "Guest email invited within hour"
      };
    }

    // If we reach this point, there are no active invitations and no invitations in the last hour.
    // Proceed to create a new invitation.
    const response = await createInvitationController(data, company.companyName);
    // ...rest of your logic (sending emails, etc.)
    return { status: response.status, message: response.message, invitation: response.invitation };
  };

  //create invitetocompany

  let alreadyInvited = await prisma.companyInvitation.findMany({
    where: {
      email: data.guest.toLowerCase(),
      company_id: parseInt(company.company_id),
    },
  });

  if (alreadyInvited.length !== 0) {
    return { status: 400, message: `This Guest email already has a pending invitation` };
  }
  if ((company.invitations.length) > company.licenses) {
    return { status: 422, message: "Not enough licenses" };
  }
  const response = await createInvitationController(data, company.companyName);

  //send email to user
  if (isNew) {

    emailCreateNewUserScript(data.guest, "../templates/invitationEmailNewAccount.html", company.companyName, response.invitation.invitation_token);

  } else {
    emailChangeCompanySenderScript(user.user_id, user.guest, "../templates/invitationEmailExistingAccount.html", company.companyName, response.invitation.invitation_token);
  };
  return { status: response.status, message: response.message, invitation: response.invitation };
}

module.exports = { inviteController };