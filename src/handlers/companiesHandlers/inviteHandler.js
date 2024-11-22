const bcrypt = require("bcrypt");

  const { inviteController } = require("../../controllers/companiesControllers/inviteController.js");
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{3,4}$/;


const inviteHandler = async (req, res) => {
  try{
  const { email } = req.body;
  
//if not email in req.body, return 400
  if (!email ) {
return res.status(400).json({ message: "Email is required" });

}

  if (!regexEmail.test(email)) {
return res.status(400).json({ message: "Invalid email format" });
}
    
    const response = await inviteController(req.body);
    return res.status(response.status).json({ message: response.message, invitation: response.invitation });

  }catch(error){
    return res.status(500).json({ errors: error.message });
  }
};

module.exports = { inviteHandler };