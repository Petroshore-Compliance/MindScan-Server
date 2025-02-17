const prisma = require("../db.js");
const { validateString, regexEmail } = require("../tools/validations.js");

const roleMiddleware = async (req, res) => {
  try {
    const { user: { email } = {} } = req.body;
    const { role } = req.query;
    const errors = [];

    if (!email) {
      errors.push("Email is required");
    } else {
      const { error } = validateString(email, "Email", regexEmail);
      if (error) errors.push(error);
    }

    if (!role) {
      errors.push("Role is required");
    } else {
      const { error } = validateString(role, "Role");
      if (error) errors.push(error);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const foundUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });


    if (!foundUser) {
      errors.push("User not found");
    } else if (foundUser.role !== role && foundUser.role !== "admin") {
      errors.push("User not authorized");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    return res.status(200).json({ access: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { roleMiddleware };