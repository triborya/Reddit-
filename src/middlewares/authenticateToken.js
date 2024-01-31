const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  const token = tokenHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide." });
  }
};

module.exports = authenticateToken;
