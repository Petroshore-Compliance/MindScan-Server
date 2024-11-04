const prisma = require('../../db.js');
const { Prisma } = require('@prisma/client');

const createCompanyController = async (data) => {
  try {
    data.subscription_plan_id = parseInt(data.subscription_plan_id, 10);

    const userExists = await prisma.user.findUnique({
      where: {
        user_id: data.user_id,
      },
    });

    if (!userExists) {
      return { status: 400, message: `user does not exist` };
    }
      
    const company = await prisma.company.create({
      data: {
        name: data.name,
        email: data.email,
        subscription_plan_id: data.subscription_plan_id,
      },
    });

    const companyadmin = await prisma.user.update({
      where: {
        user_id: data.user_id,
      },
      data: {
        role: 'admin',
        user_type: 'company',
        company_id: company.company_id,
      },
      
    });

    return {status: 200,  message: 'Company created successfully',company: company,admin: companyadmin};
  } catch (error) {

    // Check if the error is a Prisma known error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation (P2002)
      if (error.code === 'P2002' &&  error.meta.target.includes('email')) {
        return { status: 400, message: 'Email already in use' };
      }
      // Handle foreign key constraint violation (P2003)
      if (
        error.code === 'P2003' &&
        error.meta.field_name.includes('Company_subscription_plan_id_fkey')
      ) {
        return { status: 400, message: 'Invalid subscription plan ID' };
      }
    }

    return {status: 500,  message: 'An error occurred while creating the company',  error: error.message };
  }
};

module.exports = { createCompanyController };
