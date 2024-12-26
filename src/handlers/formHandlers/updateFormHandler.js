const {updateFormController} = require("../../controllers/formControllers/updateFormController.js");

const updateFormHandler = async (req, res) => {
try {
  const response = await updateFormController(req.body);
  
return res.status(response.status).json(response.message);
} catch (error) {
  res.status(500).json({ message: "Error al crear la invitación", error: error.message });
}
}

module.exports = {updateFormHandler};