const bcrypt = require("bcrypt");
const prisma = require("../../db.js");

// Solicita el petroAdmin_id, lo demás se actualiza si se le ha pasado como parámetro

const updateAdminController = async (data) => {
  if (!data.petroAdmin_id) {
    return { status: 400, message: "petroAdmin ID is required." };
  }

  // quitar email del update
  const { petroAdmin_id, ...fieldsToUpdate } = data;

  if (Object.keys(fieldsToUpdate).length === 0) {
    return { status: 422, message: "No fields to update" };
  }

  if (fieldsToUpdate.password) {
    fieldsToUpdate.password = await bcrypt.hash(fieldsToUpdate.password, 10);
  }

  const petroAdmin = await prisma.petroAdmin.update({
    where: { petroAdmin_id },
    data: fieldsToUpdate,
  });

  delete petroAdmin.password;


  return { status: 200, message: "petroAdmin updated successfully", petroAdmin: petroAdmin };
};

module.exports = { updateAdminController };
