const registerUserMiddleware = (req, res, next) => {
  let { email, password, name } = req.body;

  // Default missing fields to empty strings to avoid `typeof` errors


  const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const regexName = /^[A-Za-zÀ-ÿ\s]+$/;

  let errors = [];

  // Check that all fields are strings, not empty, and apply regex

  


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

if(name && name !== ''){

  if (typeof name !== 'string') {
    errors.push('Name must be a string.');
  } else {
    name = name.trim();
  }
  
}else{
  errors.push('Name cannot be empty.');
}

  // Return errors if any fields are invalid
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Proceed with regex validations
  if (!regexEmail.test(email)) {
    errors.push('Invalid email format.');
  }

  if (!regexPass.test(password)) {
    errors.push(
      'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.'
    );
  }

  if (!regexName.test(name)) {
    errors.push('Invalid name format.');
  }

  if (errors.length === 0) {
    next();
  } else {
    return res.status(400).json({ errors });
  }
};

module.exports = { registerUserMiddleware };