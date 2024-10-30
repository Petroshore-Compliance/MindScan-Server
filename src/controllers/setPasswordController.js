const prisma = require("../db.js");
const bcrypt = require("bcrypt");

const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;


const setPasswordController = async (user_id, newPassword) => {

  if (!regexPass.test(newPassword)) {
    return {status: 400, message: "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit." };
  }

user_id = parseInt(user_id);

await prisma.user.update({
  where: {
    user_id: user_id,
  },
  data: {
    password: await bcrypt.hash(newPassword, 10),
  },
});
return {status: 200, message: "Password updated successfully"}
}

module.exports = { setPasswordController };