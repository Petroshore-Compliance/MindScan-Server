const { 
  validateNumber,
  validateString
} = require("../../tools/validations.js");

const createFormMiddleware = async (req, res, next) => {
  let errors = [];

let {email,name,phone,language,message} = req.body;


let result = validateNumber(email, 'Email');
if (result.error) errors.push(result.error)
else req.body.email = result.value




if(errors.length > 0){
  return res.status(400).json({ errors });
}else{
  return next();
}

};



module.exports = { createFormMiddleware };