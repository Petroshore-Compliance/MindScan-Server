const prisma = require("../../db");
const { emailChangeCompanySenderScript } = require("../../tools/emailChangeCompanySenderScript.js");
const {createInvitationController} = require("../../controllers/invitationsControllers/createInvitationController.js");
const { createVerificationScript } = require("../../tools/createVerificationScript.js");
// crea una invitación para el usuario de esa empresa y envia un email
//recibe email, role, company_id, companyName
const inviteController = async (data) => {


  let isNew;

  let user = await prisma.user.findUnique({
    where: {
      email: data.email.toLowerCase(),
    },
  });

  if(!user) {
    
      user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          role: data.role,
          company_id: parseInt(data.company_id),
        },
      });
    isNew = true;
      
    
    }else { //Comprobar si es necesario invitar
      if( user.role == 'admin') {
        if(data.company_id == user.company_id) {
          return {status:400, message:"This user is the administrator of this company."};
        }else{
          return {status:400, message:"This user is the administrator of a company, you cant invite him to another company"};
        }
      }

      //recolectar las invitaciones enviadas al email por esta empresa
      let invitationsSentByCompanyToThisEmail = await prisma.companyInvitation.findMany({
        where: {
          email: data.email.toLowerCase(),
          company_id: parseInt(data.company_id),
        },
      });
      
      if (invitationsSentByCompanyToThisEmail.length > 0) {
        // Comprobar si hay invitaciones pendientres
        const hasActiveInvitation = invitationsSentByCompanyToThisEmail.some(
          (invitation) => invitation.active === true
        );

        if (hasActiveInvitation) {
          return {status:400, message: `This email already has a pending invitation`};
        }
          if(user.company_id == parseInt(data.company_id)) {
            return {status:400, message:"This user is already part of this company"};
          }

        // Si no hay ninguna pendiente, ordenar las invitaciones por "created_at"
        const mostRecentInvitation = invitationsSentByCompanyToThisEmail.reduce((latest, current) => {
          return new Date(latest.created_at) > new Date(current.created_at) ? latest : current;
        });
      
        // Si la invitacion mas reciente fue creada en el ultimo hora, devolver error
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (new Date(mostRecentInvitation.created_at) > oneHourAgo) {
          return {status:400, message: `This email has already been invited to this company within the last hour`};
        }
      }
      isNew = false;
    };

//create invitetocompany

const response = await createInvitationController(data,user.email);

//send email to user
    if(!isNew){
  emailChangeCompanySenderScript(user.user_id, user.email,"../templates/invitationEmailExistingAccount.html",data.companyName,response.invitation.invitation_token);
    }else{
        createVerificationScript(user.user_id, user.email,"../templates/invitationEmail.html",data.companyName);
    };
    return {status: response.status, message: response.message, invitation: response.invitation};
}

module.exports = { inviteController };