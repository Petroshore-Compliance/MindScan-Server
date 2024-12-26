const {createFormController} = require("../../controllers/formControllers/updateFormController.js");

const createFormHandler = async (req, res) => {
try {
  const response = await createFormController(req.body);
  
return res.status(response.status).json(response.message);
} catch (error) {
  res.status(500).json({ message: "Error al crear la invitación", error: error.message });
}
}

module.exports = {createFormHandler};