const prisma = require("../../db.js");

const updateFormController = async (data) => {
  const form = await prisma.form.update({
    where: {
      form_id: data.form_id,
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      language: data.language,
      message: data.message,
    },
  });

  return { status: 200, message: "Form updated successfully", form: form };
};

module.exports = { updateFormController };


