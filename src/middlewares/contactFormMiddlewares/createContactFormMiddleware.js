const {
  validateNumber,
  validateString,
  regexEmail,
  regexName,
  regexPhone,
} = require("../../tools/validations.js");

const createContactFormMiddleware = async (req, res, next) => {
  let errors = [];
  let result;
  let { email, name, phone, language, message } = req.body;

  result = validateString(email, "Email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value;

  result = validateString(name, "Name", regexName);
  if (result.error) errors.push(result.error);
  else req.body.name = result.value;

  result = validateNumber(phone, "Phone", regexPhone);
  if (result.error) errors.push(result.error);

  result = validateString(language, "Language");
  if (result.error) errors.push(result.error);
  else req.body.language = result.value;

  result = validateString(message, "Message");
  if (result.error) errors.push(result.error);
  else req.body.message = result.value;

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  } else {
    return next();
  }
};

module.exports = { createContactFormMiddleware };
