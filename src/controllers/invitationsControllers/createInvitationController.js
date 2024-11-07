const prisma = require("../../db.js");

//receive email and companyId, create a invitation token, then returns the 3 things
const createInvitationController = async (companyId,email) => {

  //hay que mantener la misma cantidad de 0 para que sea de 1000000 a 999999 en vez de 0 a 999999
  const invToken = Math.floor(100000 + Math.random() * 9000000);

const invitation = await prisma.companyInvitation.create({
  data: {
    email: email,
    company_id: companyId,
    invitation_token: invToken.toString(),
  },
});

return {status:200, message: 'Invitation created successfully', invitation: invitation};


}

module.exports = { createInvitationController };
