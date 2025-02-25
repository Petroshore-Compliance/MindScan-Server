const prisma = require("../../db.js");


const jwt = require("jsonwebtoken");
const { encryptJWT } = require("../../tools/auth.js");

//crea la invitación
//recibe el email y el id de la compañía
//devuelve las tres cosas en caso de exito
const createInvitationController = async (data) => {
  const company = await prisma.company.findUnique({
    where: {
      company_id: data.user.company_id,
    },
  });
  if (!company) {
    return { status: 400, message: "Company not found" };
  }
  const JWTtoken = jwt.sign(
    {
      email: data.guest.toLowerCase(),
      role: data.role,
      company_id: data.user.company_id,

    },
    process.env.JWT_SECRET,
    {
      expiresIn: "336h",

    }
  );
  const payload = { token: JWTtoken };

  const token = await encryptJWT(payload);



  const invitation = await prisma.companyInvitation.create({
    data: {
      email: data.guest.toLowerCase(),
      company_id: data.user.company_id,
      invitation_token: token.toString(),
    },
  });

  return { status: 201, message: "Invitation created successfully", invitation: invitation };
};

module.exports = { createInvitationController };
