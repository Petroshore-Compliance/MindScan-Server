const bcrypt = require("bcrypt");

const prisma = require('../../db.js');

const updateProfileController = async ( data) => {
  data.updated_at = new Date();
  data.password = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.update({
        where: { user_id: data.user_id },
        data: data,
    });

    if (!user) {
        return {status: 404, message: 'User not found'};
    }

    const { password, ...userData } = user;

    return {status: 200, message: 'User profile updated successfully', user: userData};
};

module.exports = { updateProfileController };