const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalide' });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: 'Token manquant' });
  }
};

module.exports = verifyJWT;
