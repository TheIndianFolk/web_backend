const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  me,
  logout,
} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

// Public
router.post('/signup', signup);
router.post('/login', login);

// Protected
router.get('/me', verifyToken, me);
router.post('/logout', verifyToken, logout);

module.exports = router;
