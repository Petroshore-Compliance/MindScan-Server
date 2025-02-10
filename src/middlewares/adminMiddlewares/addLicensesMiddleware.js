const { validateString, regexEmail, validateNumber } = require("../../tools/validations.js");

const addLicensesMiddleware = (req, res, next) => {
  let errors = [];
  let result;

  const { company_id, licensesNumber } = req.body;


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
