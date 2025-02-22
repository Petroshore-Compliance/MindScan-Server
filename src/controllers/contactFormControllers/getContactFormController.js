const prisma = require("../../db.js");

const getContactFormController = async (data) => {
  if (data.form_id) {
    const form = await prisma.contactForm.findUnique({
      where: {
        form_id: data.form_id,
      },
    });

    if (form) {
      return { status: 200, message: "Form found successfully", contactForms: form };
    }

    return { status: 404, message: "Form not found" };
  }

  const forms = await prisma.contactForm.findMany();

  if (forms.length === 0) {
    return { status: 404, message: "No forms found" };
  } else {
    return { status: 200, message: "Forms found successfully", contactForms: forms };
  }
};

module.exports = { getContactFormController };
