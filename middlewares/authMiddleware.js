const jwt = require('jsonwebtoken');

exports.verifyJWT = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Not authenticated — token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired token' });
    }
    // attach user payload to req.user
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  });
};
