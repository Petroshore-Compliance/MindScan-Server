const jwt = require("jsonwebtoken");
const { decryptJWT } = require("../../tools/auth.js");

const { validateString, regexPass, regexName } = require("../../tools/validations.js");

const employeeRegisterMiddleware = async (req, res, next) => {

  const { name, password, token } = req.body;

  let errors = [];
  let result;

  result = validateString(token, "Token");
  if (result.error) errors.push(result.error);

  result = validateString(password, "New Password", regexPass);
  if (result.error) errors.push(result.error);

  result = validateString(name, "Name", regexName);
  if (result.error) errors.push(result.error);

  const decryptedData = await decryptJWT(token);
  const decoded = jwt.verify(decryptedData.token, process.env.JWT_SECRET);

  req.body.company_id = decoded.company_id;
  req.body.email = decoded.email;
  req.body.role = decoded.role;

  if (errors.length === 0) {
    return next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { employeeRegisterMiddleware };
