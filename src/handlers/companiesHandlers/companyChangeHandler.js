const {
  companyChangeController,
} = require("../../controllers/companiesControllers/companyChangeController.js");

const companyChangeHandler = async (req, res) => {
  try {
    const response = await companyChangeController(req.body);
    res.status(response.status).json({ message: response.message });
  } catch (error) {
    console.log("errorrrrrrrrrrrrr", error)
    res.status(500).json({ message: "Unhandled error changing company", error: error });
  }
};
module.exports = { companyChangeHandler };
