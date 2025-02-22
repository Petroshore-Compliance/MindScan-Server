const { validateNumber } = require("../../tools/validations.js");

const getContactFormMiddleware = async (req, res, next) => {
  let errors = [];
  let result;
  let { form_id } = req.query;
  if (form_id) {
    result = validateNumber(form_id, "form_id");
    if (result.error) errors.push(result.error);
    req.body.form_id = parseInt(form_id, 10);
  }
  if (errors.length === 0) {
    next();
  } else {
    res.status(400).json({ errors });
  }
};

module.exports = { getContactFormMiddleware };
