const { validateString, validateNumber } = require("../../tools/validations.js");

const deleteAdminMiddleware = (req, res, next) => {
  let errors = [];
  const { petroAdmin_id } = req.body;

  const result = validateNumber(petroAdmin_id, "petroAdmin ID");
  if (result.error) errors.push(result.error);

  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }

  next();
};

module.exports = { deleteAdminMiddleware };
