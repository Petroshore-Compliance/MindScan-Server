const {
  getContactFormController,
} = require("../../controllers/contactFormControllers/getContactFormController.js");

const getContactFormHandler = async (req, res) => {
  try {
    const response = await getContactFormController(req.body);

    return res.status(response.status).json({ message: response.message, contactForms: response.contactForms });
  } catch (error) {
    res.status(500).json({ message: "Unhandled error getting form", error: error.message });
  }
};

module.exports = { getContactFormHandler };
