const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//solicita el user_is, lo demás se actualiza si se le ha pasado como parametro
//devuelve el usuario tras las actualizaciones sin la contraseña
const updateProfileController = async (data) => {

  const userToUpdate = await prisma.user.findUnique({
    where: {
      user_id: data.user_id,
    },
  });

  if (!userToUpdate) {
    return { status: 404, message: "User not found" };
  }

  if (data.password) {
    delete data.password;
  }
  if (data.email === userToUpdate.email) {
    delete data.email;
  }
  //esten metodo detecta que solo se ha pasado el user_id
  if (Object.keys(data).length === 1 && data.hasOwnProperty("user_id")) {
    return { status: 400, message: "User profile cannot be updated with only user_id", user: data };
  }
  console.log("data", data);
  const user = await prisma.user.update({
    where: { user_id: data.user_id },
    data: data,
  });

  const { password, ...userData } = user;

  return { status: 200, message: "User profile updated successfully", user: userData };
};

module.exports = { updateProfileController };
