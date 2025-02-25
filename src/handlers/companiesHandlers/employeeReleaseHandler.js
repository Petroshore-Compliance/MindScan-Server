const {
  employeeReleaseController,
} = require("../../controllers/companiesControllers/employeeReleaseController.js");

const employeeReleaseHandler = async (req, res) => {
  try {
    const response = await employeeReleaseController(req.body);
    res.status(response.status).json({ message: response.message, company: response.company });
  } catch (error) {
    res.status(500).json({ message: "Unhandled error releasing employee", error: error });
  }
};
module.exports = { employeeReleaseHandler };
