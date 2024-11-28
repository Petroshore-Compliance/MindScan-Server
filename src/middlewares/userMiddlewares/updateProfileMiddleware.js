const { 
  validateNumber,
  validateString
} = require("../../tools/validations.js");

const updateProfileMiddleware = (req, res, next) => {


  const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const regexName = /^[A-Za-zÀ-ÿ\s]+$/;
  const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;


  let errors = [];
  let {company_id,user_id,name,email,user_type,role,password} = req.body;

  if(company_id){
result = validateNumber(company_id, 'Company ID');
if (result.error) errors.push(result.error);
  }

    result = validateNumber(user_id, 'User ID');
    if (result.error) errors.push(result.error);
      

  if(name){
    result = validateString(name, 'Name',regexName);
    if (result.error) errors.push(result.error) ;
    else name = result.value;
      }

  if(email){
    result = validateString(email, 'Email',regexEmail);
    if (result.error) errors.push(result.error) ;
    else email = result.value;
    }

  if(password){
    result = validateString(password, 'Password',regexPass);
    if (result.error) errors.push(result.error);
    }

    if(user_type){
      if(user_type !== "individual" && user_type !== "company"){
        errors.push('Invalid user type');
      }
    }

    if(role){
      if(role !== "manager" && role !== "employee"){
        errors.push('Invalid role');
      }
    }



  if(errors.length===0){
    next();
  }else{
    return res.status(400).json({errors});
    }
}

module.exports = { updateProfileMiddleware };