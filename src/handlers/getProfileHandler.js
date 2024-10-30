const { getProfileController } = require('../controllers/getProfileController');

const getProfileHandler = async (req, res) => {
    try {
        const response = await getProfileController(req.user.id);
        res.status(response.status).json({ message: response.message, user: response.user });
    } catch (error) {
        res.status(500).json({ message: 'Error getting user profile', error: error.message });
    }
};

module.exports = { getProfileHandler };