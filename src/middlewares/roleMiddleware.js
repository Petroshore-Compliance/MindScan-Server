const { roleCheck } = require("../tools/roleCheck");


const roleMiddleware = async (req, res, next) => {

  const result = await roleCheck(req.body);

  if (result.error) {

    return res.status(result.status).json({ errors: result.error });
  } else { next(); }




};

module.exports = { roleMiddleware };
