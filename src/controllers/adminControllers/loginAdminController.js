require("dotenv").config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const prisma = require('../../db.js');


const loginAdminController = async (email, password) => {

  let petroAdmin;
  try {
    petroAdmin = await prisma.petroAdmin.update({
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



  const isPasswordValid = await bcrypt.compare(password, petroAdmin.password);

  if (!isPasswordValid) {
    return { status: 401, message: "Wrong Email or Password" };
  }

  const token = jwt.sign(
    {
      id: petroAdmin.petroAdmin_id,
      email: petroAdmin.email,
      role: petroAdmin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    }
  );

  return {
    token,
    petroAdmin: {
      id: petroAdmin.petroAdmin_id,
      name: petroAdmin.name,
      email: petroAdmin.email,
      role: petroAdmin.role,
      petroAdmin_type: petroAdmin.petroAdmin_type,
    },
    status: 200,
    message: "petroAdmin logged in successfully",
  };

}

module.exports = { loginAdminController };
