

const submitResponsesMiddleware = async (req, res, next) => {
  const { responses } = req.body;

  if (
    !Array.isArray(responses) ||
    responses.length !== 8 ||
    !responses.every(response => Number.isInteger(response) && response >= 0 && response <= 4)
  ) {
    return res.status(400).json({
      message: "Responses must be an array of 8 integers between 0 and 4"
    });
  }

  next();
}

module.exports = { submitResponsesMiddleware };