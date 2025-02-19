const prisma = require("../../db.js");

const getUsersController = async (data) => {
  const paginacionNumber = 25;
  const page = Number(data.page) || 0;

  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      name: true,
      company: {
        select: {
          name: true, // Include company name
        },
      },
    },
    take: paginacionNumber,
    skip: page * paginacionNumber,
    orderBy: { created_at: "desc" },
  });

  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / paginacionNumber);
  return {
    status: 200,
    message: "Users found",
    users: users,
    page: page + 1,
    totalPages: totalPages,
  };
};

module.exports = { getUsersController };