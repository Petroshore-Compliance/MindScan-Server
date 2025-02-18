const { validateNumber, validateString } = require("../../tools/validations.js");

const createCompanyMiddleware = (req, res, next) => {
  let errors = [];
  let result;
  let { name, email } = req.body;

  const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const regexName = /^[A-Za-zÀ-ÿ\s]+$/;

  result = validateNumber(req.body.user_id, "User ID");
  if (result.error) errors.push(result.error);
  else req.body.user_id = result.value;

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
