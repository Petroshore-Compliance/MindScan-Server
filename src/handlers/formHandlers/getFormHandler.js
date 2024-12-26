const {getFormController} = require("../../controllers/formControllers/updateFormController.js");

const getFormHandler = async (req, res) => {
try {
  const response = await getFormController(req.body);
  
return res.status(response.status).json(response.message);
} catch (error) {
  res.status(500).json({ message: "Error al crear la invitación", error: error.message });
}
}

module.exports = {getFormHandler};