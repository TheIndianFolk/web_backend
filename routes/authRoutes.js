const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  me,
  logout,
  refreshToken
} = require('../controllers/authController');
const { verifyJWT } = require('../middlewares/authMiddleware'); 

// Public
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected
router.get('/me', verifyJWT, me);
router.post('/logout', verifyJWT, logout);

module.exports = router;
