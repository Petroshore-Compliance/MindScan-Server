const bcrypt = require('bcrypt');

const prisma = require('../../db.js');


//cambiar la contraseña de un usuario
//recibe el petroAdmin_id, la contraseña actual y la nueva contraseña
//y devuelve cambio de contraseña exitoso o porque ha fallado
const changePasswordAdminController = async (petroAdmin_id, password, newPassword) => {


  const petroAdmin = await prisma.petroAdmin.findUnique({
    where: { petroAdmin_id: petroAdmin_id },
  });

  if(!petroAdmin){
    return { status: 404, message: 'petroAdmin not found.' };
  }

  const isPasswordValid = await bcrypt.compare(password, petroAdmin.password);

  if(!isPasswordValid){
    return { status: 400, message: 'Old password is incorrect.' };
  }

  const isPasswordSameAsBefore = await bcrypt.compare(newPassword, petroAdmin.password);
  if (isPasswordSameAsBefore) {
    return { status:400, message: 'New password cannot be the same as the old password.' };
  }

  
  petroAdmin.password = await bcrypt.hash(newPassword, 10);

  await prisma.petroAdmin.update({
    where: { petroAdmin_id: petroAdmin_id },
    data: { password: petroAdmin.password },
  });

  return { status:200, message: 'Password changed successfully.' };

}

module.exports = { changePasswordAdminController };