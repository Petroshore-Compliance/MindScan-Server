const { validateNumber, validateString } = require("../../tools/validations.js");

const createInvitationMiddleware = (req, res, next) => {
  let errors = [];
  let result;
  let { company_id, guest } = req.body;

  const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

  result = validateNumber(company_id, "Company ID");
  if (result.error) errors.push(result.error);

  result = validateString(guest, "guest email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value;

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { createInvitationMiddleware };
