const prisma = require("../../db.js");

const getCompaniesController = async (data) => {
  let companies;

  if (data.company_id) {
    const company = await prisma.company.findUnique({
      where: { company_id: data.company_id },
    });
    companies = company ? [company] : [];
  } else {
    companies = await prisma.company.findMany();
  }

  if (companies.length === 0) {
    return { status: 404, message: "Companies not found" };
  } else {
    console.log(companies.length);
    return { status: 200, message: "Companies found", companies };
  }
};

module.exports = { getCompaniesController };
