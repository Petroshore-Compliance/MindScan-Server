const prisma = require("../../db.js");

const deleteFormController = async (data) => {
  const form = await prisma.form.findUnique({
    where: { form_id: data.form_id },
  });
if(!form) return {status:404, message: "Form not found."};

await prisma.form.delete({
  where: { form_id: data.form_id },
});


  return { status: 200, message: "Form deleted successfully", form: form };
};

module.exports = { deleteFormController };