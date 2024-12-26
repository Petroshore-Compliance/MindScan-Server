const prisma = require("../../db.js");

const createFormController = async (data) => {
  const form = await prisma.form.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      language: data.language,
      message: data.message,
    },
  });

  return { status: 201, message: "Form created successfully", form: form };
};