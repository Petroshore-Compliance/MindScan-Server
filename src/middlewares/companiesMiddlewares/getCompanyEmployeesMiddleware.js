const { 
  validateNumber
} = require("../../tools/validations.js");

const getCompanyEmployeesMiddleware = async (req, res, next) => {

  let errors = [];
  let result;

  let { company_id,user_id } = req.body;
  
  result = validateNumber(user_id, 'User ID');
  if (result.error) errors.push(result.error);

  result = validateNumber(company_id, 'Company ID');
  if (result.error) errors.push(result.error);
  
  if(errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
}

module.exports = {
    getCompanyEmployeesMiddleware
}