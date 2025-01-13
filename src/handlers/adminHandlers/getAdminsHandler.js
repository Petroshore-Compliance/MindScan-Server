const {getAdminsController} = require("../../controllers/adminControllers/getAdminsController.js");


const getAdminsHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await getAdminsController(email);

    res.status(response.status).json({  message: response.message});

  }catch (error) {
    res.status(500).json({ message: `Unsuported error finding email ${error}` });
  }
}
module.exports = { getAdminsHandler };