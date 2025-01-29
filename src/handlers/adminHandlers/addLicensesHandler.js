const { addLicensesController } = require("../../controllers/adminControllers/addLicensesController.js");


const addLicensesHandler = async (req, res) => {

  try {
    const response = await addLicensesController(req.body);

    return res.status(response.status).json({ message: response.message });

  } catch (error) {
    return res.status(500).json({ message: `Unsuported error adding licenses ${error}` });
  }

}
module.exports = { addLicensesHandler };