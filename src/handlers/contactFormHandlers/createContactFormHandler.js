const {
  createContactFormController,
} = require("../../controllers/contactFormControllers/createContactFormController.js");

const createContactFormHandler = async (req, res) => {
  try {
    const response = await createContactFormController(req.body);

    return res.status(response.status).json({ message: response.message, form: response.form });
  } catch (error) {
    res.status(500).json({ message: "Unhandled error creating form", error: error.message });
  }
};

module.exports = { createContactFormHandler };
