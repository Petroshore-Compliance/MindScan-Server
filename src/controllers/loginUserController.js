const jwt = require('jsonwebtoken');
const prisma = require('../db.js');
const bcrypt = require('bcrypt');
require("dotenv").config();


const loginUserController = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error('Correo electrónico o contraseña inválidos');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Correo electrónico o contraseña inválidos');
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
    }
  };
};

module.exports = { loginUserController };
