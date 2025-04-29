const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const userController = require('../controllers/userController');

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.get('/watchlist', verifyToken, userController.getWatchlist);
router.post('/watchlist', verifyToken, userController.toggleWatchlist);
router.get('/history', verifyToken, userController.getHistory);
router.post('/history', verifyToken, userController.updateWatchHistory);

module.exports = router;
