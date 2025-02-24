const { validateString } = require("../../tools/validations.js");

const companyChangeMiddleware = async (req, res, next) => {
  let errors = [];
  let result;

  const { token } = req.body;

  result = validateString(token, "Token");
  if (result.error) errors.push(result.error);
  else req.body.token = result.value;


  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = {
  companyChangeMiddleware,
};
