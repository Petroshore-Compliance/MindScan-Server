

const createInvitationMiddleware = (req, res, next) => {
let errors = [];

let { company_id,email } = req.body;

const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

if (company_id && company_id !== '') {
  if (typeof company_id !== 'number' ) {
    errors.push('company id must be a number.');
  }
} else {
  errors.push('company id cannot be empty.');
}


if(email && email !== ''){

  if (typeof email !== 'string') {
    errors.push('Email must be a string.');
  } else {
  if (!regexEmail.test(email)) {
    errors.push('Invalid email format.');
  }else{    
    email = email.trim().toLowerCase();
    }
  }
  
}else{
  errors.push('Email cannot be empty.');
}


if(errors.length===0){
next();
}else{
return res.status(400).json({errors});

}
}

module.exports = { createInvitationMiddleware };