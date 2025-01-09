const {createFormController} = require("../../controllers/formControllers/createFormController.js");

const createFormHandler = async (req, res) => {
try {
  const response = await createFormController(req.body);
  
  return res.status(response.status).json({message: response.message,form:response.form});
} catch (error) {
  res.status(500).json({ message: "Error al crear la invitación", error: error.message });
}
}

module.exports = {createFormHandler};