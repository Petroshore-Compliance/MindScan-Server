const roleMiddleware = (req, res, next) => {
  const { userRole, neededRole } = req.body;

  if (userRole === neededRole) {
    res.status(200).json({ message: "Access granted" });
    return next(); 
  } else {
    res.status(403).json({ message: "Access denied, role requirement not met" });
  }
};

module.exports = { roleMiddleware };
