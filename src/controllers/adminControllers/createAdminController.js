const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//este método se encarga de crear un nuevo usuario en la base de datos
// recibe como parámetros el email, la contraseña, el nombrey el id de la compañía
// y devuelve un objeto con la respuesta del registro del usuario
const createAdminController = async (email, password, name) => {
  //si el tipo es individual, significa que no está conectado a una compañía
  const emailInUse = await prisma.petroAdmin.findUnique({
    where: {
      email: email,
    },
  });

  if (emailInUse) {
    return { status: 409, message: "Email already in use" };
  }

  const newpetroAdmin = await prisma.petroAdmin.create({
    data: {
      name,
      email: email,
      password: await bcrypt.hash(password, 10),
    },
  });

  return { status: 201, message: "petroAdmin registered successfully", petroAdmin: newpetroAdmin };
};

module.exports = {
  createAdminController,
};
