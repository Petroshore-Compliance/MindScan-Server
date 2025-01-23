require("dotenv").config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const prisma = require('../../db.js');


const loginUserController = async (email, password) => {

  let user;
  try {
    user = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { connected_at: new Date() },
    });

  } catch (error) {
    //error p2025 es porque no existe usuario con este email
    if (error.code === "P2025") {
      return { status: 404, message: "Wrong Email or Password" };
    }
    throw error;
  };




  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { status: 401, message: "Wrong Email or Password" };
  }

  const token = jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    }
  );

  return {
    token,
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      user_type: user.user_type,
    },
    status: 200,
    message: "User logged in successfully",
  };

}

module.exports = { loginUserController };
