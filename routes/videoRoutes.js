const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const upload = multer({ dest: 'uploads/original/' });


router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.get('/category/:slug', videoController.getVideosByCategory);
const verifyToken = require('../middlewares/verifyToken');
router.post('/', verifyToken, videoController.createVideo);
router.delete('/:id', verifyToken, videoController.deleteVideo);
router.put('/:id', verifyToken, videoController.updateVideo);
router.post('/upload', verifyToken, upload.single('video'), videoController.uploadAndProcessVideo);

module.exports = router;
