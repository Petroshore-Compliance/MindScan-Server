const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//cambiar la contraseña de un usuario
//recibe el user_id, la contraseña actual y la nueva contraseña
//y devuelve cambio de contraseña exitoso o porque ha fallado
const changePasswordController = async (data
) => {


  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
  });

  if (!user) {
    return { status: 404, message: "User not found." };
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    return { status: 401, message: "Old password is incorrect." };
  }

  const isPasswordSameAsBefore = await bcrypt.compare(data.newPassword, user.password);
  if (isPasswordSameAsBefore) {
    return { status: 422, message: "New password cannot be the same as the old password." };
  }

  user.password = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: { email: data.user.email },
    data: { password: user.password },
  });

  return { status: 200, message: "Password changed successfully." };
};

module.exports = { changePasswordController };
