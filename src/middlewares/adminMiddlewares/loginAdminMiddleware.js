const { validateString } = require("../../tools/validations.js");
const loginAdminMiddleware = (req, res, next) => {
  let { email, password } = req.body;

  const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  let result;
  let errors = [];

  result = validateString(email, "Email", regexEmail);
  if (result.error) errors.push(result.error);
  else req.body.email = result.value;

  if (password && password !== "") {
    if (typeof password !== "string") {
      errors.push("Password must be a string.");
    }
  } else {
    errors.push("Password cannot be empty.");
  }

  // si hay errores, los devuelve
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // regex
  if (!regexEmail.test(email)) {
    errors.push("Invalid email format.");
  }

  if (!regexPass.test(password)) {
    errors.push(
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit."
    );
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { loginAdminMiddleware };
