const prisma = require('../db.js');
const bcrypt = require('bcrypt');

const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;


const changePasswordController = async (user_id, password, newPassword) => {

  const parsed_user_id = parseInt(user_id);

  const user = await prisma.user.findUnique({
    where: { user_id: parsed_user_id },
  });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid){
    return { status: 400, message: 'Old password is incorrect.' };
  }

  const isPasswordSameAsBefore = await bcrypt.compare(newPassword, user.password);
  if (isPasswordSameAsBefore) {
    return { status:400, message: 'New password cannot be the same as the old password.' };
  }

  if (!regexPass.test(newPassword)) {
    return { status:400, message: 'New password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.' };
  }
  
  user.password = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { user_id: parsed_user_id },
    data: { password: user.password },
  });

  return { status:200, message: 'Password changed successfully.' };

}

module.exports = { changePasswordController };