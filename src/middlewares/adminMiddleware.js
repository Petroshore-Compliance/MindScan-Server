const { validateString, regexEmail } = require("../tools/validations.js");
const prisma = require("../db.js");

const jwt = require("jsonwebtoken");
const { decryptJWT } = require("../tools/auth.js");


const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    const decryptedData = await decryptJWT(token);
    const decoded = jwt.verify(decryptedData.token, process.env.JWT_SECRET);

    //req.user = decoded;

  } catch (error) {
    return res.status(401).json({ message: "Acceso denegado, token inválido" });
  }





















  const { email, adminEmail } = req.body;
  let result;
  if (adminEmail) {
    result = validateString(adminEmail, "Email", regexEmail);
    if (result.error) return res.status(400).json({ errors: [result.error] });
  } else {
    result = validateString(email, "Email", regexEmail);
    if (result.error) return res.status(400).json({ errors: [result.error] });
  }

  const user = await prisma.petroAdmin.findUnique({
    where: {
      email: result.value,
    },
  });

  if (user) {
    next();
    return;
  }

  return res.status(403).json({ errors: "Forbidden" });
};

module.exports = { adminMiddleware };
