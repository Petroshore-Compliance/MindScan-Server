const prisma = require("../../db.js");

//devuelve los datos de una empresa y sus empleados
//recibe el id de la empresa
//devuelve un objeto con el mensaje y la empresa si la encuentra
const getCompanyController = async (data) => {

  const company = await prisma.company.findUnique({
    where: {
      company_id: data.user.company_id,
    },
    include: {
      users: {
        select: {
          user_id: true,
          email: true,
          role: true,
          name: true,
        },
      },
    },
  });

  if (!company) {
    return { status: 404, message: "Company not found" };
  }

  return { status: 200, message: "Company found", company: company };
};

module.exports = { getCompanyController };
