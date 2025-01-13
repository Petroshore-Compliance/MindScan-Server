const { 
  validateNumber,
  validateString,
  regexEmail,
  regexName,  
  regexPass
} = require("../../tools/validations.js");

const updateAdminMiddleware = (req, res, next) => {



let result;
  let errors = [];
  let {company_id,user_id,name,email,role,password} = req.body;

  if(company_id){
 result = validateNumber(company_id, 'Company ID');
if (result.error) errors.push(result.error);
  }

    result = validateNumber(user_id, 'User ID');
    if (result.error) errors.push(result.error);
      

  if(name){
    result = validateString(name, 'Name',regexName);
    if (result.error) errors.push(result.error) ;
    else req.body.name = result.value;
      }

  if(email){
    result = validateString(email, 'Email',regexEmail);
    if (result.error) errors.push(result.error) ;
    else req.body.email = result.value;
    }

  if(password){
    result = validateString(password, 'Password',regexPass);
    if (result.error) errors.push(result.error);
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

module.exports = { updateAdminMiddleware };