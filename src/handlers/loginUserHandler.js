const { loginUserController } = require('../controllers/loginUserController');

const loginUserHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        const response = await loginUserController(email, password);
if(response.message == "The user is not verified"){
    return res.status(401).json({message: 'User not verified'})
}

        res.status(200).json({ message: 'User logged in successfully', response});
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
}

module.exports = { loginUserHandler };