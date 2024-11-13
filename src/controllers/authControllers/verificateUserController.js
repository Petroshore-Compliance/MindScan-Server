const { parse } = require("dotenv");

const prisma = require("../../db");

const verificateUserController = async (userId, code) => { 

  if(!userId || !code) {return { status: 400, message: "User ID and verification code are required" };}

    userId = parseInt(userId);

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
