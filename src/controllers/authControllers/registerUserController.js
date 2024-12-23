const bcrypt = require("bcrypt");

const prisma = require("../../db.js");

//pendiente de eliminar
//const { createVerificationScript } = require("../../tools/createVerificationScript.js");


//este método se encarga de crear un nuevo usuario en la base de datos
// recibe como parámetros el email, la contraseña, el nombre, el tipo de usuario, el rol y el id de la compañía
// y devuelve un objeto con la respuesta del registro del usuario
const registerUserController = async (
  email,
  password,
  name,
  role,
  company_id
) => {

//si el tipo es individual, significa que no está conectado a una compañía
  const emailInUse = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (emailInUse) {
    return {status: 400, message: 'Email already in use'};
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email: email,
      password:  await bcrypt.hash(password, 10),
      role: role,
      company: company_id
        ? {
            connect: { company_id: company_id },
          }
        : undefined,
    },
  });
  //pendiente de eliminar
  //llamada al script que envía el corrreo de verificación (tools/createVerificationScript.js)
  //createVerificationScript(newUser.user_id, newUser.email,"../templates/verificationEmail.html");

  return {status: 201, message: 'User registered successfully', user: newUser};
};

module.exports = {
  registerUserController,
};
