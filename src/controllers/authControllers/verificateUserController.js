const { parse } = require("dotenv");

const prisma = require("../../db");

//este método verifica el usuario (elimina el registro de la tabla verificationCodes)
//recibe el id del usuario y el código de verificación
//devuelve un objeto con el estado del método y un mensaje

const verificateUserController = async (userId, code) => { 


    const findUser = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!findUser) {
      return { status: 404, message: "User not found" };
    }

    const verificationCodeFound = await prisma.VerificationCode.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!verificationCodeFound) {
      return { status: 400, message: "The user is already verified" };
    }

    await prisma.verificationCode.delete({
      where: {
        user_id: userId,
      },
    });
    
    return { status: 200, message: "User verified successfully" };
}

module.exports = { verificateUserController };
