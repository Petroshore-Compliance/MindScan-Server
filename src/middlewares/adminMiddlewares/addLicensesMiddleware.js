const { validateString, regexEmail, validateNumber } = require("../../tools/validations.js");

const addLicensesMiddleware = (req, res, next) => {
  let errors = [];
  let result;

  const { company_id, licensesNumber, email } = req.body;

  result = validateString(email, "Email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value;

  result = validateNumber(company_id, "Company ID");
  if (result.error) errors.push(result.error);

  result = validateNumber(licensesNumber, "Number of licenses");
  if (result.error) errors.push(result.error);

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { addLicensesMiddleware };
