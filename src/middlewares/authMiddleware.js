const jwt = require("jsonwebtoken");
const { decryptJWT } = require("../tools/auth.js");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    const decryptedData = await decryptJWT(token);

    const decoded = jwt.verify(decryptedData.token, process.env.JWT_SECRET);

    req.body.email = req.body.email || decoded.email;


    next();
  } catch (error) {
    res.status(401).json({ message: "Acceso denegado, token inválido" });
  }
};

module.exports = { authMiddleware };
