const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const { validateString, validateNumber } = require("../../tools/validations.js");

const changePasswordMiddleware = (req, res, next) => {
  const { user_id, password, newPassword } = req.body;
  let errors = [];
  let result;

  result = validateString(password, "Password", regexPass);
  if (result.error) errors.push(result.error);

  result = validateString(newPassword, "New password", regexPass);
  if (result.error) errors.push(result.error);

  if (user_id && user_id !== "") {
    if (isNaN(user_id) || parseInt(user_id) !== Number(user_id)) {
      errors.push("User id must be a number.");
    }
  } else {
    errors.push("User id cannot be empty.");
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { changePasswordMiddleware };
