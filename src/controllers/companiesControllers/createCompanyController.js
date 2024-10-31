const { parse } = require('dotenv');
const prisma = require('../../db.js');

const createCompanyController = async (data) => {
  try {

    data.subscription_plan_id = parseInt(data.subscription_plan_id);
    const company = await prisma.company.create({
      data: {
        name: data.name,
        email: data.email,
        subscription_plan_id: data.subscription_plan_id,
        users: data.user_id
        ? {
            connect: { users: data.user_id },
          }
        : undefined,
         }
    });
    return {status: 200, message: 'Company created successfully', company: company};
  } catch (error) {
    console.error("Unhandled error creating company:", error);
//    return {status: 400, message: 'email already in use'};
throw error;

  }
};


module.exports = { createCompanyController };