const prisma = require('../db.js');

const getProfileController = async (userID) => {
    const user = await prisma.user.findUnique({
        where: { user_id: userID },
        include: {
            company: true,
            responses: true,
            results: true,
            access: true,
            VerificationCodes: true
        }
    })

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userData } = user;

    return userData;
};

module.exports = { getProfileController };