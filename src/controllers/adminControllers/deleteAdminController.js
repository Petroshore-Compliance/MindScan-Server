const prisma = require("../../db.js");

const deleteAdminController = async (data) => {
  const petroAdmin = await prisma.petroAdmin.findUnique({
    where: { petroAdmin_id: data.petroAdmin_id },
  });

  if (!petroAdmin) {
    return { status: 404, message: "petroAdmin not found" };
  }

  await prisma.petroAdmin.delete({
    where: { petroAdmin_id: data.petroAdmin_id },
  });

  return { status: 200, message: "petroAdmin deleted successfully" };
};

module.exports = { deleteAdminController };
