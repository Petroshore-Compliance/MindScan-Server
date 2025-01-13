const bcrypt = require('bcrypt');

const prisma = require('../../db.js');


//cambiar la contraseña de un usuario
//recibe el user_id, la contraseña actual y la nueva contraseña
//y devuelve cambio de contraseña exitoso o porque ha fallado
const changePasswordAdminController = async (user_id, password, newPassword) => {

  const parsed_user_id = parseInt(user_id);

  const user = await prisma.user.findUnique({
    where: { user_id: parsed_user_id },
  });

  if(!user){
    return { status: 404, message: 'User not found.' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid){
    return { status: 400, message: 'Old password is incorrect.' };
  }

  const isPasswordSameAsBefore = await bcrypt.compare(newPassword, user.password);
  if (isPasswordSameAsBefore) {
    return { status:400, message: 'New password cannot be the same as the old password.' };
  }

  
  user.password = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { user_id: parsed_user_id },
    data: { password: user.password },
  });

  return { status:200, message: 'Password changed successfully.' };

}

module.exports = { changePasswordAdminController };