const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const { validateString, validateNumber } = require("../../tools/validations.js");

const changePasswordMiddleware = (req, res, next) => {
  const { password, newPassword } = req.body;
  let errors = [];
  let result;

  result = validateString(password, "Password", regexPass);
  if (result.error) errors.push(result.error);

  result = validateString(newPassword, "New password", regexPass);
  if (result.error) errors.push(result.error);


  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { changePasswordMiddleware };
