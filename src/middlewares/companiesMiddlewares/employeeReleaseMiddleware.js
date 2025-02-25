const { validateNumber } = require("../../tools/validations.js");

const employeeReleaseMiddleware = async (req, res, next) => {
  let errors = [];
  let result;


  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = {
  employeeReleaseMiddleware,
};
