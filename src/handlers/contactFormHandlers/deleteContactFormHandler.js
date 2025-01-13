const {deleteContactFormController} = require("../../controllers/contactFormControllers/deleteContactFormController.js");

const deleteContactFormHandler = async (req, res) => {
try {
  const response = await deleteContactFormController(req.body);
  
return res.status(response.status).json(response.message);
} catch (error) {
  res.status(500).json({ message: "Unhandled error deleting form", error: error.message });
}
}

module.exports = {deleteContactFormHandler};

