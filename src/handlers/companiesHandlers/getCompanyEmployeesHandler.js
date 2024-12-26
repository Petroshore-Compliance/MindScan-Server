const { getCompanyEmployeesController } = require("../../controllers/companiesControllers/getCompanyEmployeesController.js");

const getCompanyEmployeesHandler = async (req, res) => {

try {
    const response = await getCompanyEmployeesController(req.body);
    res.status(response.status).json({
        message: response.message,
        employees: response.employees
      });} catch (error) {
    res.status(500).json({ message: "Unhandled error getting company employees",error: error.message });
  }

}

module.exports = {
    getCompanyEmployeesHandler
}