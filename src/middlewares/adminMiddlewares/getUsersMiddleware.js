
const getUsersMiddleware = (req, res, next) => {

  const { page } = req.query;

  let errors = [];

  if (page && page >= 0) {
    req.body.page = page;
  } else if (page) {
    errors.push("Page must be a positive number.");
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { getUsersMiddleware };
