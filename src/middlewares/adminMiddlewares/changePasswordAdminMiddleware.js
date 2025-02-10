const { validateString, regexPass } = require("../../tools/validations.js");

const changePasswordAdminMiddleware = (req, res, next) => {
  const { petroAdmin_id, password, newPassword } = req.body;
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

module.exports = { changePasswordAdminMiddleware };
