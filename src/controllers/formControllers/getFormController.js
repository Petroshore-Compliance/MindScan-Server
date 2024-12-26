const prisma = require("../../db.js");


const getFormController = async (data) => {
  const form = await prisma.form.findUnique({
    where: {
      form_id: data.form_id,
    },
  });
  return { status: 200, message: "Form found successfully", form: form };
};

module.exports = { getFormController };