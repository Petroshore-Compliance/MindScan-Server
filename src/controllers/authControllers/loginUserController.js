require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { encryptJWT } = require("../../tools/auth.js");
const prisma = require("../../db.js");

const loginUserController = async (email, password) => {
  let user;
  try {
    user = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { connected_at: new Date() },
      include: {
        company: true,
      },
    });
  } catch (error) {
    //error p2025 es porque no existe usuario con este email
    if (error.code === "P2025") {
      return { status: 404, message: "Wrong Email or Password" };
    }
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { status: 401, message: "Wrong Email or Password" };
  }

  const JWTtoken = jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_name: user.company?.name || null,
      company_id: user.company?.company_id || null,
      company_email: user.company?.email || null,
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
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    status: 200,
    message: "User logged in successfully",
  };
};

module.exports = { loginUserController };
