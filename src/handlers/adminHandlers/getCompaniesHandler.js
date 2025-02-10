const {
  getCompaniesController,
} = require("../../controllers/adminControllers/getCompaniesController.js");
const { petroAdmin } = require("../../db.js");

const getCompaniesHandler = async (req, res) => {
  try {
    const response = await getCompaniesController(req.body);

    return res
      .status(response.status)
      .json({ message: response.message, companies: response.companies });
  } catch (error) {
    return res.status(500).json({ message: `Unsuported error getting companies ${error}` });
  }
};
module.exports = { getCompaniesHandler };
