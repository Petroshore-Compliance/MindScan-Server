const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//cambiar la contraseña de un usuario que ha olvidado su contraseña
//recibe el email y la nueva contraseña
//y devuelve cambio de contraseña exitoso o fallido
const setPasswordController = async (data) => {



  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  await prisma.user.update({
    where: {
      email: data.email.toLowerCase(),
    },
    data: {
      password: await bcrypt.hash(data.newPassword, 10),
    },
  });
  return { status: 200, message: "Password updated successfully" };
};

module.exports = { setPasswordController };
