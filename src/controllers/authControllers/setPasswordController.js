const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;


const setPasswordController = async (user_id, newPassword) => {

  if(!user_id ){return {status: 400, message: "User ID is required."};}
  if(!newPassword){return {status: 400, message: "New password is required."};}

  if (!regexPass.test(newPassword)) {
    return {status: 400, message: "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit." };
  }

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

module.exports = { setPasswordController };