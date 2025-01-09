const { 
  validateString,
  validateNumber,
  regexEmail,
  regexName,
  regexPhone
} = require("../../tools/validations.js");

const updateFormMiddleware = async (req, res, next) => {
  let errors = [];
  let result;

  //se puede actualizar cualquier cantidad de cosas siempre que se actualice al menos una(función en  el controller)
  //message no incluido porque no tiene sentido ser capaces de editar el mensaje enviado por el usuario
  //posible nuevo campo en form llamado comentario
  let { name, email, phone, language,message,form_id } = req.body;

if(message){
errors.push("message cannot be updated");}

  result = validateNumber(form_id, 'Form ID');
  if (result.error) errors.push(result.error);
  

  if (name) {
     result = validateString(name, 'Name', regexName);
    if (result.error) errors.push(result.error);
    else req.body.name = result.value; 
  }

  if (email) {
     result = validateString(email, 'Email', regexEmail);
    if (result.error) errors.push(result.error);
    else req.body.email = result.value; 
  }

  if (phone) {
     result = validateString(phone, 'Phone', regexPhone);
    if (result.error) errors.push(result.error);
    else req.body.phone = result.value; 
  }

  if (language) {
     result = validateString(language, 'Language');
    if (result.error) errors.push(result.error);
    else req.body.language = result.value; 
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { updateFormMiddleware };