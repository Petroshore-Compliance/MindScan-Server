

const { createCompanyController } = require('../../controllers/companiesControllers/createCompanyController.js');

const createCompanyHandler = async (req, res) => {
    try {
        const response = await createCompanyController(req.body);
        res.status(response.status).json({ message: response.message, company: response.company });
    } catch (error) {
        res.status(500).json({ message: 'Unhandled error creating company', error: error.message });
    }
};
module.exports = { createCompanyHandler };