const prisma = require('../../db.js');

const getCompanyController = async (companyId) => {
if(!companyId){
  return {status: 400, message: 'company id is required'};
}

    const company = await prisma.company.findUnique({
      where: {
        company_id: companyId,
      },
      include: {
        users: {
          select: {
            user_id: true,
            email: true,
            role: true,
            name: true,
          }
        },
      },
    });

    if (!company) {
      return {status: 404, message: 'Company not found'};
    }

    return {status: 200, message: 'Company found', company: company};

};

module.exports = { getCompanyController };
