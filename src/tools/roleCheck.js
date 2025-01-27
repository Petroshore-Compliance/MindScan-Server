const prisma = require('../db.js');
const { validateString, regexEmail } = require("../tools/validations.js");



const roleCheck = async (data) => {

  const { neededRole, email } = data;



  let result = validateString(neededRole, 'neededRole');
  if (result.error) return { error: "no valid role", status: 400, message: result.error };


  result = validateString(email, 'Email', regexEmail);
  if (result.error) return { error: "no valid email", status: 400, message: result.error };

  let user = await prisma.user.findUnique({
    where: {
      email: result.value,
    },
  })

  if (!user) {
    return { error: "user not found", status: 404, message: "User not found" }
  }

  if (user.role !== neededRole && user.role !== 'admin') {
    return { error: "user not authorized", status: 403, message: "User not authorized" }
  }
  return { error: null, status: 100, message: "User authorized" }
};
module.exports = {
  roleCheck
};