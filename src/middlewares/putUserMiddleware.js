const registerUserMiddleware = (req, res, next) => {
  const { email, password, name } = req.body;

  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{3,4}$/;
  const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const regexName = /^[A-Za-zÀ-ÿ\s]+$/;

  let message = [];

  if (!email || !password || !name) {
    message.push("All fields are required.");
  }

  if (!regexEmail.test(email)) {
    message.push("Invalid email format.");
  }

  if (!regexPass.test(password)) {
    message.push(
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit."
    );
  }

  if (!regexName.test(name)) {
    message.push("Invalid name format.");
  }

  if (message.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors: message });
  }
};

module.exports = { registerUserMiddleware };
