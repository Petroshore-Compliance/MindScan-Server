const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//cambiar la contraseña de un usuario que ha olvidado su contraseña
//recibe el user_id y la nueva contraseña
//y devuelve cambio de contraseña exitoso o fallido
const setPasswordAdminController = async (user_id, newPassword) => {


const user = await prisma.user.findUnique({
  where: { user_id: parseInt(user_id) },
});

if(!user){
  return {status:404, message: "User not found"}
}

await prisma.user.update({
  where: {
    user_id: user.user_id,
  },
  data: {
    password: await bcrypt.hash(newPassword, 10),
  },
});
return {status: 200, message: "Password updated successfully"}
}

module.exports = { setPasswordAdminController };