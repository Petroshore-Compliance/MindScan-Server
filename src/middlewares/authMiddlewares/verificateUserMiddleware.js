const verificateUserMiddleware = (req, res, next) => {

  const { user_id,verificationCode } = req.body;
let errors = [];

if (user_id && user_id !== '') {
  if (isNaN(user_id) || parseInt(user_id) !== Number(user_id)) {
    errors.push('User id must be a number.');
  }
} else {
  errors.push('User id cannot be empty.');
}

if (verificationCode && verificationCode !== '') {
  if (isNaN(verificationCode)) {
    errors.push('Verification code must be a number.');
  }
} else {
  errors.push('Verification code cannot be empty.');
}

if(errors.length===0){
  next();
}else{
return res.status(400).json({errors});
}
};

module.exports = { verificateUserMiddleware };