const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decryptJWT } = require("../../tools/auth.js");
const prisma = require("../../db.js");

//cambiar la contraseña de un usuario que ha olvidado su contraseña
//recibe el email y la nueva contraseña
//y devuelve cambio de contraseña exitoso o fallido
const setPasswordController = async (data) => {
  const { token, password } = data;

  const decryptedData = await decryptJWT(token);
  const decoded = jwt.verify(decryptedData.token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({
    where: { email: decoded.email.toLowerCase() },
  });

  if (!user) {
    return { status: 404, message: "User not found" };
  }
  await prisma.user.update({
    where: { email: decoded.email.toLowerCase() },
    data: { password: await bcrypt.hash(password, 10) },
  });
  return { status: 200, message: "Password updated successfully" };
};

module.exports = { setPasswordController };
