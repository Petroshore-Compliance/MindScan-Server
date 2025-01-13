const prisma = require("../../db.js");


const getContactFormController = async (data) => {
  const form = await prisma.contactForm.findUnique({
    where: {
      form_id: data.form_id,
    },
  });
  return { status: 200, message: "Form found successfully", form: form };
};

module.exports = { getContactFormController };