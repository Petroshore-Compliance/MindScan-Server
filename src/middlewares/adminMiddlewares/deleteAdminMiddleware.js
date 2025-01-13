const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const { validateString, validateNumber } = require("../../tools/validations.js");

const deleteAdminMiddleware = (req, res, next) => {


  next();
};

module.exports = { deleteAdminMiddleware };