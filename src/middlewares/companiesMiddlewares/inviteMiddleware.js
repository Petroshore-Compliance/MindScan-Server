const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const { validateNumber, validateString } = require("../../tools/validations.js");

const inviteMiddleware = (req, res, next) => {
  let errors = [];
  let result;
  let { guest } = req.body;
  result = validateString(guest, "Guest email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value.toLowerCase();



  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { inviteMiddleware };
