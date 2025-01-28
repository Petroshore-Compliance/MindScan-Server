const { validateString, regexEmail, regexPass } = require("../../tools/validations.js");

const setPasswordAdminMiddleware = (req, res, next) => {

  const { email, newPassword } = req.body;
  let errors = [];
  let result = validateString(email, 'Email', regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value;

  result = validateString(newPassword, 'New Password', regexPass);
  if (result.error) errors.push(result.error);


  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }


};

module.exports = { setPasswordAdminMiddleware };