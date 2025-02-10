const e = require("express");
const prisma = require("../../db.js");

const getCompanyEmployeesController = async (data) => {
  const requestingUser = await prisma.user.findUnique({
    where: {
      user_id: data.user.user_id,
    },
  });

  if (!requestingUser) {
    return { status: 404, message: "User not found" };
  }

  const requestedCompany = await prisma.company.findUnique({
    where: {
      company_id: data.company_id,
    },
    select: {
      company_id: true,
      name: true,
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

  if (!requestedCompany) {
    return { status: 404, message: "Company not found" };
  }

  if (requestedCompany.company_id !== requestingUser.company_id) {
    return { status: 403, message: "User is not a part of this company" };
  }

  if (requestingUser.role !== "admin" && requestingUser.role !== "manager") {
    return { status: 403, message: "User does not have permission" };
  }

  return { status: 200, employees: requestedCompany.users, message: "Employees found" };
};

module.exports = {
  getCompanyEmployeesController,
};
