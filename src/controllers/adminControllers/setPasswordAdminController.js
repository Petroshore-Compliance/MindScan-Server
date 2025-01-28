const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//cambiar la contraseña de un usuario que ha olvidado su contraseña
//recibe el email y la nueva contraseña
//y devuelve cambio de contraseña exitoso o fallido
const setPasswordAdminController = async (email, newPassword) => {
  const petroAdmin = await prisma.petroAdmin.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!petroAdmin) {
    return { status: 404, message: "petroAdmin not found" };
  }

  await prisma.petroAdmin.update({
    where: { email: email.toLowerCase() },
    data: { password: await bcrypt.hash(newPassword, 10) },
  });

  return { status: 200, message: "Password updated successfully" };
};

module.exports = { setPasswordAdminController };