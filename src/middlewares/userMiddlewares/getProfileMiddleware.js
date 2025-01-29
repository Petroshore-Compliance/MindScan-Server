const { validateNumber } = require("../../tools/validations.js");

const getProfileMiddleware = (req, res, next) => {
  let { user_id } = req.body;
  let result;
  let errors = [];

  result = validateNumber(user_id, "User ID");
  if (result.error) errors.push(result.error);
  else req.body.user_id = result.value;

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { getProfileMiddleware };
