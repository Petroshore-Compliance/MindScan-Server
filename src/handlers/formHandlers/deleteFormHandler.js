const {deleteFormController} = require("../../controllers/formControllers/deleteFormController.js");

const deleteFormHandler = async (req, res) => {
try {
  const response = await deleteFormController(req.body);
  
return res.status(response.status).json(response.message);
} catch (error) {
  res.status(500).json({ message: "Error al crear la invitación", error: error.message });
}
}

module.exports = {deleteFormHandler};

