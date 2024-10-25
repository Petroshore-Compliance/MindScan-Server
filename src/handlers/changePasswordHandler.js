const { changePasswordController } = require('../controllers/changePasswordController.js');

const changePasswordHandler = async (req, res) => {
    try {
        const { user_id, password, newPassword } = req.body;

        const response = await changePasswordController(user_id, password, newPassword);
        
        switch (response.status) {
          case 'SUCCESS':
            res.status(200).json({ message: 'Password changed successfully', response});
            break;
          case 'BAD_OLD_PASSWORD':
            res.status(400).json({ message: 'Old password is incorrect.'});
            break;
          case 'WEAK_NEW_PASSWORD':
            res.status(400).json({ message: 'New password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one digit.'});
            break;
          case 'NEW_PASSWORD_IS_THE_SAME_AS_OLD_PASSWORD':
            res.status(400).json({ message: 'New password is the same as the old password.'});
            break;
          default:
            res.status(500).json({ message: 'Unsuported error changing password', error: error.message });
            break;
        }

    }catch(error){
        res.status(500).json({ message: 'Unsuported error changing password', error: error.message });
    }
  }

module.exports = {changePasswordHandler};