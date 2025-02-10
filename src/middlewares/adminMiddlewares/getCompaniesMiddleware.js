const { validateString, validateNumber, regexEmail } = require("../../tools/validations.js");

const getCompaniesMiddleware = (req, res, next) => {
  let errors = [];
  let result;
  const { company_id } = req.body;

  if (company_id) {
    result = validateNumber(company_id, "Company ID");
    if (result.error) errors.push(result.error);
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { getCompaniesMiddleware };
