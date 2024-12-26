const prisma = require("../../db.js");

const deleteFormController = async (data) => {
  const form = await prisma.form.delete({
    where: {
      form_id: data.form_id,
    },
  });
  return { status: 200, message: "Form deleted successfully", form: form };
};

module.exports = { deleteFormController };