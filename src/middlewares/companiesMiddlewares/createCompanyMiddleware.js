const { 
  validateNumber,
  validateString
} = require("../../tools/validations.js");

const createCompanyMiddleware = (req, res, next) => {

let errors = [];

let { name, email, subscription_plan_id, user_id } = req.body;

const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
const regexName = /^[A-Za-zÀ-ÿ\s]+$/;


result = validateNumber(user_id, 'User ID');
if (result.error) errors.push(result.error);
else user_id = result.value;

result = validateNumber(subscription_plan_id, 'Subscription plan ID');
if (result.error) errors.push(result.error);
else subscription_plan_id = result.value;


result = validateString(email,'Email',regexEmail);
if(result.error) errors.push(result.error);
else email = result.value;

result = validateString(name,'Name',regexName);
if(result.error) errors.push(result.error);
else name = result.value;

if (errors.length === 0) {
  next();
} else {
  return res.status(400).json({ errors });
}



}

module.exports = { createCompanyMiddleware };