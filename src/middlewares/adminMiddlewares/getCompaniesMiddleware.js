
const { validateString, validateNumber, regexEmail } = require("../../tools/validations.js");

const getCompaniesMiddleware = (req, res, next) => {

  let errors = [];
  let result;
  const { company_id, email } = req.body;

  result = validateString(email, 'Email', regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value;

  if (company_id) {
    result = validateNumber(company_id, 'Company ID');
    if (result.error) errors.push(result.error);
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }

};

module.exports = { getCompaniesMiddleware };