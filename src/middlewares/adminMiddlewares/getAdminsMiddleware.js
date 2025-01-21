const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const { validateString, validateNumber } = require("../../tools/validations.js");

const getAdminsMiddleware = (req, res, next) => {
  
let errors = [];
let result;

if(req.petroAdmin_id){
  result = validateNumber(req.petroAdmin_id, 'Company ID');
  if (result.error) errors.push(result.error);
}


if (errors.length === 0) {
  next();
} else {
  return res.status(400).json({ errors });
}
  
};

module.exports = { getAdminsMiddleware };