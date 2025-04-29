const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // First Try cookie first
  let token = req.cookies?.token;

  // Then Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    token = authHeader?.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });
    }
    req.user = user;
    next();
  });
}

module.exports = verifyToken;
