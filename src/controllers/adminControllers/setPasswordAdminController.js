const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//cambiar la contraseña de un usuario que ha olvidado su contraseña
//recibe el petroAdmin_id y la nueva contraseña
//y devuelve cambio de contraseña exitoso o fallido
const setPasswordAdminController = async (petroAdmin_id, newPassword) => {


const petroAdmin = await prisma.petroAdmin.findUnique({
  where: { petroAdmin_id: parseInt(petroAdmin_id) },
});

if(!petroAdmin){
  return {status:404, message: "petroAdmin not found"}
}

await prisma.petroAdmin.update({
  where: {
    petroAdmin_id: petroAdmin.petroAdmin_id,
  },
  data: {
    password: await bcrypt.hash(newPassword, 10),
  },
});
return {status: 200, message: "Password updated successfully"}
}

module.exports = { setPasswordAdminController };