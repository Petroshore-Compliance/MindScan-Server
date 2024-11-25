const loginUserMiddleware = (req, res, next) => {
  let { email, password } = req.body;

  const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  let errors = [];  

if(email && email !== ''){

  if (typeof email !== 'string') {
    errors.push('Email must be a string.');
  } else {
    email = email.trim().toLowerCase();
  }
  
}else{
  errors.push('Email cannot be empty.');
}

if(password && password !== ''){

  if (typeof password !== 'string') {
    errors.push('Password must be a string.');
  } 
  
}else{
  errors.push('Password cannot be empty.');
}

  // si hay errores, los devuelve
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // regex
  if (!regexEmail.test(email)) {
    errors.push('Invalid email format.');
  }

  if (!regexPass.test(password)) {
    errors.push(
      'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.'
    );
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { loginUserMiddleware };