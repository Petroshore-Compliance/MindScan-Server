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
    return { status: 'BAD_OLD_PASSWORD' };
  }

  const isPasswordSameAsBefore = await bcrypt.compare(newPassword, user.password);
  if (isPasswordSameAsBefore) {
    return { status: 'NEW_PASSWORD_IS_THE_SAME_AS_OLD_PASSWORD' };
  }

  if (!regexPass.test(newPassword)) {
    return { status: 'WEAK_NEW_PASSWORD' };
  }
  
  user.password = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { user_id: parsed_user_id },
    data: { password: user.password },
  });

  return { status: 'SUCCESS' };

}

module.exports = { changePasswordController };