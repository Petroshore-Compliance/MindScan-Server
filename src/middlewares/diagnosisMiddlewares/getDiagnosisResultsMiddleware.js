const getDiagnosisResultsMiddleware = (req, res, next) => {

  if (req.query.result_id) {
    req.body.result_id = req.query.result_id;
  }

  next();


};

module.exports = { getDiagnosisResultsMiddleware };