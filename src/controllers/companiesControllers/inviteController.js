const prisma = require("../../db");
const { emailChangeCompanySenderScript } = require("../../tools/emailChangeCompanySenderScript.js");
const {createInvitationController} = require("../../controllers/invitationsControllers/createInvitationController.js");
const { createVerificationScript } = require("../../tools/createVerificationScript.js");

//recibe email, role, company_id, companyName y crea una invitación para el usuario de esa empresa y envia un email
const inviteController = async (data) => {

if(!data.email || !data.role || !data.company_id || !data.companyName){
  return {status:400, message: 'All fields are required.'};
}

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
          user_type: "company",
          role: data.role,
          company_id: parseInt(data.company_id),
        },
      });
    isNew = true;
      
    
    }else { //all checks to know if the need of a new invitation is really needed
      if( user.role == 'admin') {
        if(data.company_id == user.company_id) {
          return {status:400, message:"This user is the administrator of this company."};
        }else{
          return {status:400, message:"This user is the administrator of a company, you cant invite him to another company"};

        }

      }

      let invitationsSentByCompanyToThisEmail = await prisma.companyInvitation.findMany({
        where: {
          email: data.email.toLowerCase(),
          company_id: parseInt(data.company_id),
        },
      });
      
      if (invitationsSentByCompanyToThisEmail.length > 0) {
        // Check if any invitation is pending
        const hasActiveInvitation = invitationsSentByCompanyToThisEmail.some(
          (invitation) => invitation.active === true
        );
      
        
        
        if (hasActiveInvitation) {
          
          return {status:400, message: `This email already has a pending invitation`};
        }
          if(user.company_id == parseInt(data.company_id)) {
            return {status:400, message:"This user is already part of this company"};
          }
        

      
        // If none are pending, find the most recent invitation based on "created_at"
        const mostRecentInvitation = invitationsSentByCompanyToThisEmail.reduce((latest, current) => {
          return new Date(latest.created_at) > new Date(current.created_at) ? latest : current;
        });
      
        // Check if the most recent invitation was created within the last hour
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