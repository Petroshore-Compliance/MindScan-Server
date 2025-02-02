const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//solicita el user_is, lo demás se actualiza si se le ha pasado como parametro
//devuelve el usuario tras las actualizaciones sin la contraseña
const updateProfileController = async (data) => {

  delete data.token;
  const userToUpdate = await prisma.user.findUnique({
    where: {
      email: data.user.email,
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
  delete data.user;

  //esten metodo detecta que solo se ha pasado el user_id
  if (Object.keys(data).length === 0) {
    return { status: 400, message: "No valid data to update" };
  }
  console.log("data", data);

  const user = await prisma.user.update({
    where: { email: userToUpdate.email },
    data: data,
  });

  const { password, ...userData } = user;

  return { status: 200, message: "User profile updated successfully", user: userData };
};

module.exports = { updateProfileController };
