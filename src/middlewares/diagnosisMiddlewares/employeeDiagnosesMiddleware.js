const { validateString, validateNumber, regexEmail } = require("../../tools/validations.js");

const employeeDiagnosesMiddleware = (req, res, next) => {

  const { employeeEmail, result_id } = req.body;
  let result;
  let errors = [];
  if (result_id) {
    result = validateNumber(result_id, "result ID");
    if (result.error) errors.push(result.error);
  }


  result = validateString(employeeEmail, "Employee email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value;

  if (!errors.length === 0) {
    return res.status(400).json({ errors });
  }

  //después de validar los datos enviados, se cambia el email del administrador del usuario para reutilizar el controlador
  req.body.user.email = employeeEmail;

  next();
};

module.exports = { employeeDiagnosesMiddleware };
