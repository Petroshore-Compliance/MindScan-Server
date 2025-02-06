const { validateString, regexPass } = require("../../tools/validations.js");

const setPasswordMiddleware = (req, res, next) => {
  const { password, token } = req.body;
  let errors = [];
  let result;

  result = validateString(password, "New Password", regexPass);
  if (result.error) errors.push(result.error);

  if (!token) {
    errors.push("Token is required");
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { setPasswordMiddleware };
