const { parse } = require("dotenv");
const prisma = require("../db");

const verificateUserController = async (userId, code) => { 

  console.log(userId, code);
  if(!userId || !code){
    return { success: false, message: "Missing parameters" };}

    userId = parseInt(userId);

    findUser = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!findUser) {
      return { success: false, message: "The user does not exist" };
    }

    const verificationCodeFound = await prisma.VerificationCode.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!verificationCodeFound) {
      return { success: false, message: "The user is already verified" };
    }

    await prisma.verificationCode.delete({
      where: {
        user_id: userId,
      },
    });
    
    return { success: true, message: "User verified successfully" };
}

module.exports = { verificateUserController };
