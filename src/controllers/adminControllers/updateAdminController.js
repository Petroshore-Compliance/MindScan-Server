const bcrypt = require("bcrypt");
const prisma = require("../../db.js");

// Solicita el petroAdmin_id, lo demás se actualiza si se le ha pasado como parámetro

const updateAdminController = async (data) => {
  delete data.password;
  delete data.petroAdmin_id;
  const auxEmail = data.user.email.toLowerCase();

  //andrei, compruebo el usuario actual para ver si se cambia el email, que no sea el mismo que antes
  const userToUpdate = await prisma.petroAdmin.findUnique({
    where: {
      email: data.user.email.toLowerCase(),
    },
  });

  if (!userToUpdate) {
    return { status: 404, message: "User not found" };
  }

  if (data.email && data.email.toLowerCase() === userToUpdate.email) {
    delete data.email;
  }
  delete data.user;

  if (Object.keys(data).length === 0) {
    return { status: 422, message: "No fields to update" };


  }

  const petroAdmin = await prisma.petroAdmin.update({
    where: { email: auxEmail },
    data: data,
    select: {
      name: true,
      email: true,
    },
  });



  return { status: 200, message: "petroAdmin updated successfully", petroAdmin: petroAdmin };
};

module.exports = { updateAdminController };
