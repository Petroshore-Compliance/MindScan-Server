const bcrypt = require("bcrypt");
const prisma = require("../../db.js");

// Solicita el petroAdmin_id, lo demás se actualiza si se le ha pasado como parámetro

const updateAdminController = async (data) => {
  delete data.password;
  const auxEmail = data.user.email;
  delete data.user;
  delete data.petroAdmin_id;


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
  console.log(petroAdmin)



  return { status: 200, message: "petroAdmin updated successfully", petroAdmin: petroAdmin };
};

module.exports = { updateAdminController };
