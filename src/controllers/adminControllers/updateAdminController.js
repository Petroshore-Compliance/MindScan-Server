const bcrypt = require("bcrypt");

const prisma = require('../../db.js');



//solicita el user_is, lo demás se actualiza si se le ha pasado como parametro
//devuelve el usuario tras las actualizaciones sin la contraseña
const updateAdminController = async (data) => {
    
    //esten metodo detecta que solo se ha pasado el user_id 
    if (Object.keys(data).length === 1 && data.hasOwnProperty('user_id')) {
        return { status: 400, message: 'User profile cannot be updated with only user_id', user: data };
    }
  
    data.password = await bcrypt.hash(data.password, 10);
    
      const user = await prisma.user.update({
          where: { user_id: data.user_id },
          data: data,
      });
  
      const { password, ...userData } = user;
  
      return {status: 200, message: 'User profile updated successfully', user: userData};
  }



module.exports = { updateAdminController };