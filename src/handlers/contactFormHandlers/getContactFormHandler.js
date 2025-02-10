const {
  getContactFormController,
} = require("../../controllers/contactFormControllers/updateContactFormController.js");

const getContactFormHandler = async (req, res) => {
  try {
    const response = await getContactFormController(req.body);

    return res.status(response.status).json(response.message);
  } catch (error) {
    res.status(500).json({ message: "Unhandled error getting form", error: error.message });
  }
};

module.exports = { getContactFormHandler };
