const prisma = require("../../db.js");

const updateFormController = async (data) => {

  if (Object.keys(data).length === 1 && data.hasOwnProperty('form_id')) {
    return { status: 400, message: 'form cannot be updated with only form_id', form: data };
}

const formExists = await prisma.form.findUnique({
  
  where: {
    form_id: data.form_id,
    
  },

});

if (!formExists) {
  return { status: 404, message: 'Form not found', form: formExists };
}


   const updatedForm = await prisma.form.update({
    where: {
      form_id: data.form_id,
    },
    data: data,

  });

  return { status: 200, message: "Form updated successfully", form: formExists, updatedform: updatedForm };
};

module.exports = { updateFormController };


