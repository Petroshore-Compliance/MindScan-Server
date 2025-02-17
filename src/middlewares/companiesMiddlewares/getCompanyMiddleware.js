const { validateNumber } = require("../../tools/validations.js");

const getCompanyMiddleware = (req, res, next) => {
  let errors = [];


  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { getCompanyMiddleware };
