const prisma = require("../../db.js");

//crea la invitación
//recibe el email y el id de la compañía
//devuelve las tres cosas en caso de exito
const createInvitationController = async (data) => {

  const company = await prisma.company.findUnique({
    where: {
      company_id: data.company_id,
    }
});
if(!company){
  return {status:400, message: 'Company not found'};
}
let uniqueInvitationToken = false;
let tokenUsed;
let invToken;
while(!uniqueInvitationToken){
  //hay que mantener la misma cantidad de 0 para que sea de 1000000 a 999999 en vez de 0 a 999999
  invToken = Math.floor(1000000000 + Math.random() * 90000000000);

  tokenUsed = await prisma.companyInvitation.findUnique({
    where: {
      invitation_token: invToken.toString(),
    },
  });

  if(!tokenUsed){
    uniqueInvitationToken = true;
  }

}

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
