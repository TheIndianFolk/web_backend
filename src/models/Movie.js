const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  youtubeLink: String, // YouTube link for streaming
});

module.exports = mongoose.model('Movie', movieSchema);
