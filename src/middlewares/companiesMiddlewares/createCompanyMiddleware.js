const { validateNumber, validateString, regexEmail, regexName } = require("../../tools/validations.js");

const createCompanyMiddleware = (req, res, next) => {
  let errors = [];
  let result;
  let { name, email, adminEmail } = req.body;



  result = validateString(adminEmail, "Admin email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.adminEmail = result.value;



  result = validateString(email, "Email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value;

  result = validateString(name, "Name", regexName);
  if (result.error) errors.push(result.error);
  else req.body.name = result.value;

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { createCompanyMiddleware };
