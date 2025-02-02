const jwt = require("jsonwebtoken");
const { decryptJWT } = require("../tools/auth.js");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    let decryptedJwt = await decryptJWT(token);
    if (decryptedJwt.token) { decryptedJwt = decryptedJwt.token }
    const decoded = jwt.verify(decryptedJwt, process.env.JWT_SECRET);

    req.body.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Acceso denegado, token inválido", error: error.message });
  }
};

module.exports = { authMiddleware };