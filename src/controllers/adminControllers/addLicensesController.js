const bcrypt = require('bcrypt');

const prisma = require('../../db.js');


const addLicensesController = async (data) => {

  const company = await prisma.company.findUnique({
    where: { company_id: data.company_id },
  });

  if (!company) {
    return { status: 404, message: 'Company not found.' };
  }

  if (Number.isInteger(data.licensesNumber) && data.licensesNumber > 0) {
    company.licenses = company.licenses + data.licensesNumber;
    await prisma.company.update({
      where: { company_id: data.company_id },
      data: { licenses: company.licenses },
    });
    return { status: 200, message: data.licensesNumber + 'licenses added successfully to a total of ' + company.licenses + ' licenses.' };
  }
  else {
    return { status: 400, message: 'Licenses number cannot be negative nor a decimal.' };
  }

}

module.exports = { addLicensesController };