const bcrypt = require("bcrypt");

const prisma = require('../../db.js');

const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{3,4}$/;
const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const regexName = /^[A-Za-zÀ-ÿ\s]+$/;

//solicita el user_is, lo demás se actualiza sis e le ha pasado un parametro
const updateProfileController = async ( data) => {
    
    //esten metodo detecta que solo se ha pasado el user_id 
    if (Object.keys(data).length === 1 && data.hasOwnProperty('user_id')) {
        return { status: 400, message: 'User profile cannot be updated with only user_id', user: data };
    }
  data.updated_at = new Date();
console.log(data);
  
    if(!data.user_id){
      return {status:400, message: 'User id is required'};
    }

  if (data.email && !regexEmail.test(data.email)) {
    return {status:400, message: 'Invalid email format.'};
  }

  if (data.password && !regexPass.test(data.password)) {
return {status:400, message: 'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.'};
    
  }

  if (data.name && !regexName.test(data.name)) {
    return {status:400, message: 'Invalid name format.'};
  }

  data.password = await bcrypt.hash(data.password, 10);
  

    const user = await prisma.user.update({
        where: { user_id: data.user_id },
        data: data,
    });

    

    const { password, ...userData } = user;

    return {status: 200, message: 'User profile updated successfully', user: userData};
};

module.exports = { updateProfileController };