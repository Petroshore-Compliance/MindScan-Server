
const prisma = require('../../db.js');

const updateProfileController = async (userID, data) => {
  data.updated_at = new Date();
    const user = await prisma.user.update({
        where: { user_id: userID },
        data: data,
    });

    if (!user) {
        return {status: 404, message: 'User not found'};
    }

    const { password, ...userData } = user;

    return {status: 200, message: 'User profile updated successfully', user: userData};
};

module.exports = { updateProfileController };