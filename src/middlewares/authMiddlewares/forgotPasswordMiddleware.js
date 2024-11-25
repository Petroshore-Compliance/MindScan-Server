const forgotPasswordMiddleware = (req, res, next) => {
  let { email } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email cannot be empty.' });
  }

  if (typeof email !== 'string') {
    return res.status(400).json({ message: 'Email must be a string.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  req.body.email = email.trim().toLowerCase();

  next();
};

module.exports = { forgotPasswordMiddleware };