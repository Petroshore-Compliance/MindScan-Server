const {updateFormController} = require("../../controllers/formControllers/updateFormController.js");

const updateFormHandler = async (req, res) => {
try {
  const response = await updateFormController(req.body);
  
return res.status(response.status).json({message: response.message});
} catch (error) {
  res.status(500).json({ message: "unhandled error updating form", error: error.message });
}
}

module.exports = {updateFormHandler};