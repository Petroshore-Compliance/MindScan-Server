const { validateNumber, validateString } = require("../../tools/validations.js");

const getInvitationMiddleware = (req, res, next) => {
  let errors = [];
  let result;
  let { invitation_id } = req.body;

  if (invitation_id) {
    result = validateNumber(invitation_id, "Invitation ID");
    if (result.error) errors.push(result.error);
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { getInvitationMiddleware };
