const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// API endpoint to get movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API endpoint to add a new movie
router.post('/', async (req, res) => {
  const { title, description, thumbnail, youtubeLink } = req.body;

  const movie = new Movie({
    title,
    description,
    thumbnail,
    youtubeLink,
  });

  try {
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
