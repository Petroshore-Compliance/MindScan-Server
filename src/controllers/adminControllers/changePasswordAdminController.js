const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//cambiar la contraseña de un usuario
//recibe el petroAdmin_id, la contraseña actual y la nueva contraseña
//y devuelve cambio de contraseña exitoso o porque ha fallado
const changePasswordAdminController = async (data) => {
  const petroAdmin = await prisma.petroAdmin.findUnique({
    where: { petroAdmin_id: data.user.petroAdmin_id },
  });

  if (!petroAdmin) {
    return { status: 404, message: "petroAdmin not found." };
  }

  const isPasswordValid = await bcrypt.compare(data.password, petroAdmin.password);

  if (!isPasswordValid) {
    return { status: 401, message: "Old password is incorrect." };
  }

  const isPasswordSameAsBefore = await bcrypt.compare(data.newPassword, petroAdmin.password);
  if (isPasswordSameAsBefore) {
    return { status: 422, message: "New password cannot be the same as the old password." };
  }

  petroAdmin.password = await bcrypt.hash(data.newPassword, 10);

  await prisma.petroAdmin.update({
    where: { petroAdmin_id: data.user.petroAdmin_id },
    data: { password: petroAdmin.password },
  });

  return { status: 200, message: "Password changed successfully." };
};

module.exports = { changePasswordAdminController };
