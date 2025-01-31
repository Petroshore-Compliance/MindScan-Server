require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { encryptJWT } = require("../../tools/auth.js");

const prisma = require("../../db.js");

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
  }

  const isPasswordValid = await bcrypt.compare(password, petroAdmin.password);

  if (!isPasswordValid) {
    return { status: 401, message: "Wrong Email or Password" };
  }

  const JWTtoken = jwt.sign(
    {
      id: petroAdmin.petroAdmin_id,
      email: petroAdmin.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    }
  );

  const payload = { token: JWTtoken };

  const token = await encryptJWT(payload);


  return {
    token,
    petroAdmin: {
      id: petroAdmin.petroAdmin_id,
      name: petroAdmin.name,
      email: petroAdmin.email,
      notifications: petroAdmin.notifications,
    },
    status: 200,
    message: "petroAdmin logged in successfully",
  };
};

module.exports = { loginAdminController };
