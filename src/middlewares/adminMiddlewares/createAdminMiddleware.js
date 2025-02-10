const { validateNumber, validateString } = require("../../tools/validations.js");

const createAdminMiddleware = (req, res, next) => {
  let { email, password, name } = req.body;

  // Default missing fields to empty strings to avoid `typeof` errors

  const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const regexName = /^[A-Za-zÀ-ÿ\s]+$/;

  let errors = [];
  let result;
  // Check that all fields are strings, not empty, and apply regex

  result = validateString(email, "Email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value;

  result = validateString(password, "Password", regexPass);
  if (result.error) errors.push(result.error);
  else req.body.password = result.value;

  result = validateString(name, "Name", regexName);
  if (result.error) errors.push(result.error);
  else req.body.name = result.value;

  // Return errors if any fields are invalid
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { createAdminMiddleware };
