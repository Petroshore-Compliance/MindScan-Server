const prisma = require("../../db.js");

//pendiente de implementar
//comprobación de si hace falta la creación del contactform
//const { createVerificationScript } = require("../../tools/createVerificationScript.js");



const createContactFormController = async (data) => {
  const form = await prisma.contactForm.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      language: data.language.toLowerCase(),
      message: data.message,
    },
  });

  return { status: 201, message: "Form created successfully", form: form };
};

module.exports = { createContactFormController };
