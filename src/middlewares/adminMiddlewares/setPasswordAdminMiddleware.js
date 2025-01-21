const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;


const setPasswordAdminMiddleware = (req, res, next) => {

  const { petroAdmin_id, newPassword } = req.body;
  let errors = [];

  if(newPassword && newPassword !== ''){

    if (typeof newPassword !== 'string') {
      errors.push('Password must be a string.');
    } 
    
  }else{
    errors.push('Password cannot be empty.');
  }

  if (petroAdmin_id && petroAdmin_id !== '') {
    if (isNaN(petroAdmin_id) || parseInt(petroAdmin_id) !== Number(petroAdmin_id)) {
      errors.push('petroAdmin id must be a number.');
    }
  } else {
    errors.push('petroAdmin id cannot be empty.');
  }
  
  if (!regexPass.test(newPassword)) {
    errors.push(
      'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.'
    );
  }

if(errors.length === 0) {
  next();
} else {
  return res.status(400).json({ errors });
}

  
};

module.exports = { setPasswordAdminMiddleware };