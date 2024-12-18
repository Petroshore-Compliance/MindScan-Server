const prisma = require('../../db.js');

//devuelve el perfil del usuario con el id que se le pasa
//recibe el user_id
//devuelve todo menos el password
const getProfileController = async (userID) => {
    const user = await prisma.user.findUnique({
        where: { user_id: userID },
        include: {
            company: true,
            userResponses:true,
            userResult: true,
            access: true,
            VerificationCodes: true
        }
    })

    if (!user) {
        return {status: 404, message: 'User not found'};
    }

    const { password, ...userData } = user;
    return {status: 200, message: 'User profile found', user: userData};
};

module.exports = { getProfileController };