const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//este método se encarga de crear un nuevo usuario en la base de datos
// recibe como parámetros el email, la contraseña, el nombre, el tipo de usuario, el rol y el id de la compañía
// y devuelve un objeto con la respuesta del registro del usuario
const registerUserController = async (email, password, name, role, company_id) => {
  //si el tipo es individual, significa que no está conectado a una compañía
  const emailInUse = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (emailInUse) {
    return { status: 409, message: "Email already in use" };
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      role: role,
      company: company_id
        ? {
          connect: { company_id: company_id },
        }
        : undefined,
    },
  });
  return { status: 201, message: "User registered successfully", user: newUser };
};

module.exports = {
  registerUserController,
};
