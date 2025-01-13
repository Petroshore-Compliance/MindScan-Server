const {updateContactFormController} = require("../../controllers/contactFormControllers/updateContactFormController.js");

const updateContactFormHandler = async (req, res) => {
try {
  const response = await updateContactFormController(req.body);
  
return res.status(response.status).json({message: response.message});
} catch (error) {
  res.status(500).json({ message: "unhandled error updating form", error: error.message });
}
}

module.exports = {updateContactFormHandler};