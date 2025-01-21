const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const { validateString, validateNumber } = require("../../tools/validations.js");

const changePasswordAdminMiddleware = (req, res, next) => {
  
const { petroAdmin_id, password, newPassword } = req.body;
let errors = [];
let result;

result = validateString(password,'Password',regexPass);
if(result.error) errors.push(result.error);


result = validateString(newPassword,'New password',regexPass);
if(result.error) errors.push(result.error);

if (petroAdmin_id && petroAdmin_id !== '') {
  if (isNaN(petroAdmin_id) || parseInt(petroAdmin_id) !== Number(petroAdmin_id)) {
    errors.push('petroAdmin id must be a number.');
  }
} else {
  errors.push('petroAdmin id cannot be empty.');
}

if (errors.length === 0) {
  next();
} else {
  return res.status(400).json({ errors });
}
  
};

module.exports = { changePasswordAdminMiddleware };