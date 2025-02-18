

const getQuestionAnswersMiddleware = async (req, res, next) => {

  let { language } = req.body;

  if (language != "es" && language != "en" && language != "pt") {
    return res.status(400).json({ message: "language must be es, en or pt" });
  }

  next();
}

module.exports = { getQuestionAnswersMiddleware };