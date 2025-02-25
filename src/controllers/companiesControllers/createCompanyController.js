const prisma = require("../../db.js");
const { Prisma } = require("@prisma/client");
const { emailCreatedCompanyScript } = require("../../tools/emailCreatedCompanyScript.js");
//crea una compañía
//recibe nombre, email, subscription_plan_id, user_id
//devuelve un objeto con el mensaje y la compañía creada
const createCompanyController = async (data) => {
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        user_id: data.user_id,
      },
    });

    if (!userExists) {
      return { status: 404, message: `user does not exist` };
    }

    if (userExists.role === "admin") {
      return { status: 422, message: `user is already an admin` };
    }

    const company = await prisma.company.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
      },
    });

    const companyadmin = await prisma.user.update({
      where: {
        user_id: data.user_id,
      },
      data: {
        role: "admin",
        company_id: company.company_id,
      },
    });



    await emailCreatedCompanyScript(
      companyadmin.email,
      companyadmin.name,
      company.name,
      company.email,
      "../templates/createdCompanyEmail.html"
    );

    return {
      status: 201,
      message: "Company created successfully",
      company: company,
      admin: companyadmin,
    };
  } catch (error) {
    // Check if the error is a Prisma known error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation (P2002)
      if (error.code === "P2002" && error.meta.target.includes("email")) {
        return { status: 409, message: "Email already in use" };
      }
    }

    return {
      status: 500,
      message: "An error occurred while creating the company",
      error: error.message,
    };
  }
};

module.exports = { createCompanyController };
