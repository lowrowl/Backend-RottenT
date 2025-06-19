const express = require('express');
const router = express.Router();
const tmdbController = require('../controllers/tmdb.controller');

// Endpoint de populares
router.get('/popular', tmdbController.getPopularMovies);

// Búsqueda por título
router.get('/search', tmdbController.searchTMDb);

module.exports = router;