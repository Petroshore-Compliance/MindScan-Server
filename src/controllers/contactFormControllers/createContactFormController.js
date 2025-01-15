const prisma = require("../../db.js");

//comprobación de si hace falta la creación del contactform
const { createVerificationScript } = require("../../tools/createVerificationScript.js");



const createContactFormController = async (data) => {

  const alreadyExist = await prisma.contactForm.findFirst({
    where: {
      email: data.email,
    },
    orderBy: {
      created_at: "desc",
    },
  });
if (alreadyExist) {
  const noSeDebeEnviar = await createVerificationScript(alreadyExist.state);
  if(noSeDebeEnviar.reason){
    console.log("noSeDebeEnviar", noSeDebeEnviar.reason);
    return { status: 400, message: noSeDebeEnviar.reason };
  }
}

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
