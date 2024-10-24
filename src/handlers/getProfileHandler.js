const { getProfileController } = require('../controllers/getProfileController');

const getProfileHandler = async (req, res) => {
    try {
        const response = await getProfileController(req.user.id);
        res.status(200).json({ message: 'User profile retrieved successfully', response });
    } catch (error) {
        res.status(500).json({ message: 'Error getting user profile', error: error.message });
    }
};

module.exports = { getProfileHandler };