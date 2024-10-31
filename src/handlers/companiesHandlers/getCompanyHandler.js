const {getCompanyController} = require("../../controllers/companiesControllers/getCompanyController.js");

const getCompanyHandler = async (req, res) => {

try {
  const {companyId} =req.body;
  const response = await getCompanyController({companyId});
  res.status(response.status).json({message: response.message, company: response.company});

} catch (error) {
  res.status(500).json({ message: "Error al obtener la empresa", error:error });
  }
}
module.exports = { getCompanyHandler };