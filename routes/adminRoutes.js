const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/verifyToken'); // You may extend this to check admin role later

router.get('/video-stats', verifyToken, adminController.getVideoStats);
router.get('/summary', verifyToken, adminController.getSummary);
router.delete('/users/:id', verifyToken, adminController.deleteUser);


module.exports = router;
