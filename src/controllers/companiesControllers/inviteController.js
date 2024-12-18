const prisma = require("../../db");

const { emailChangeCompanySenderScript } = require("../../tools/emailChangeCompanySenderScript.js");
const { emailCreateNewUserScript } = require("../../tools/emailCreateNewUserScript.js");

const {createInvitationController} = require("../../controllers/invitationsControllers/createInvitationController.js");

    //pendiente de eliminar
//eliminar tras la finalización de adaptación de código a que ahora los usuarios se crean con un email; román 12/12/2024
const { createVerificationScript } = require("../../tools/createVerificationScript.js");

// crea una invitación para el usuario y envia un email
//recibe email, role, company_id
const inviteController = async (data) => {

  let isNew;

  let company = await prisma.company.findUnique({
    where: {
      company_id: data.company_id,
    },
    include: {
      invitations: true
    }
  });

if(company.invitations.length > company.licenses){
  return {status:400, message: "Too many invitations"};
}

  let user = await prisma.user.findUnique({
    where: {
      email: data.email.toLowerCase(),
    },
  });


  if(!company){
    return {status: 400, message: "Company not found"};
  }
company
  if(!user) {
    //pendiente de eliminar
    /*
      user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          role: data.role,
          company_id: parseInt(data.company_id),
        },
      });
      */
    isNew = true;
      
    
    }else { //Comprobar si es necesario invitar
      if( user.role == 'admin') {
        if(data.company_id == user.company_id) {
          return {status:400, message:"This user is the administrator of this company."};
        }else{
          return {status:400, message:"This user is the administrator of a company, you cant invite him to another company"};
        }
      }

          if(user.company_id == parseInt(data.company_id)) {
            return {status:400, message:"This user is already part of this company"};
          }

      //recolectar las invitaciones enviadas al email por esta empresa
      let invitationsSentByCompanyToThisEmail = await prisma.companyInvitation.findMany({
        where: {
          email: data.email.toLowerCase(),
          company_id: parseInt(data.company_id),
        },
      });
      
      if (invitationsSentByCompanyToThisEmail.length > 0) {
        

          return {status:400, message: `This email already has a pending invitation`};
        }
        

    };

//create invitetocompany

const response = await createInvitationController(data,company.companyName);

//send email to user
    if(isNew){
      
      let alreadyInvited = await prisma.companyInvitation.findMany({
        where: {
          email: data.email.toLowerCase(),
          company_id: parseInt(data.company_id),
        },
      });

      if (alreadyInvited.length > 0) {
        return {status:400, message: `This email already has a pending invitation`};
      }

      emailCreateNewUserScript(data.email,"../templates/invitationEmailNewAccount.html",data.companyName,response.invitation.invitation_token);
          //pendiente de eliminar
      //createVerificationScript(user.user_id, user.email,"../templates/invitationEmail.html",data.companyName);
    }else{
      emailChangeCompanySenderScript(user.user_id, user.email,"../templates/invitationEmailExistingAccount.html",company.companyName,response.invitation.invitation_token);
    };
    return {status: response.status, message: response.message, invitation: response.invitation};
}

module.exports = { inviteController };