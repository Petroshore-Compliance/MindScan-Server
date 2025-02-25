const { validateNumber, validateString, regexEmail } = require("../../tools/validations.js");

const updateInvitationMiddleware = (req, res, next) => {
  let errors = [];
  let result;

  const { guest } = req.body;



  result = validateString(guest, "Guest email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.guest = result.value;




  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { updateInvitationMiddleware };
