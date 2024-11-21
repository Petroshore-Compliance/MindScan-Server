const prisma = require("../../db.js");

//receive email and companyId, create a invitation token, then returns the 3 things
const createInvitationController = async (data) => {

  if(!data.companyId && !data.company_id || !data.email){
    return {status:400, message: data.company_id ? 'Email is required' : 'Company id is required'};
  }

  const company = await prisma.company.findUnique({
    where: {
      company_id: data.company_id,
    }
});
if(!company){
  return {status:400, message: 'Company not found'};
}
  //hay que mantener la misma cantidad de 0 para que sea de 1000000 a 999999 en vez de 0 a 999999
  const invToken = Math.floor(100000 + Math.random() * 9000000);

const invitation = await prisma.companyInvitation.create({
  data: {
    email: data.email,
    company_id: data.company_id,
    invitation_token: invToken.toString(),
  },
});

return {status:201, message: 'Invitation created successfully', invitation: invitation};


}

module.exports = { createInvitationController };
