const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{3,4}$/;

const { 
  validateNumber,
  validateString
} = require("../../tools/validations.js");

const inviteMiddleware = (req, res, next) => {

let errors = [];

let {email, role, company_id, companyName} = req.body;


result = validateString(email,'Email',regexEmail);
if(result.error) errors.push(result.error);
else email = result.value;

result = validateString(role,'Role');
if(result.error) errors.push(result.error);

result = validateString(companyName,'Company Name');
if(result.error) errors.push(result.error);

result = validateNumber(company_id, 'Company ID');
if(result.error) errors.push(result.error);

if (errors.length === 0) {
  next();
}else{
  return res.status(400).json({ errors });
}

}

module.exports = { inviteMiddleware };