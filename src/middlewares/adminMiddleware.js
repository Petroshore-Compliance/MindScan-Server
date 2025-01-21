const {
  validateString,
  regexEmail
} = require("../tools/validations.js");
const prisma = require('../db.js');


const jwt = require('jsonwebtoken');

const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

  } catch (error) {
    return res.status(401).json({ message: 'Acceso denegado, token inválido' });
  }

  const { email } = req.body;
  let result = validateString(email, 'Email', regexEmail);
  if (result.error) return res.status(400).json({ errors: [result.error] });


  const user = await prisma.petroAdmin.findUnique({
    where: {
      email: result.value,
    },
  })

  if (user) {
    next();
    return
  }

  return res.status(400).json({ errors: "wrong email" });
};

module.exports = { adminMiddleware };
