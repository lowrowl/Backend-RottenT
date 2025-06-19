const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const auth = require('../middleware/auth');

// Rutas protegidas
router.post('/tmdb/:tmdbId', auth, movieController.addMovieByTMDbId); // más específica, va primero
router.get('/', movieController.getAllMovies);
router.post('/', auth, movieController.addMovie);
router.get('/:id', movieController.getMovieById); // esta va al final
router.get('/tmdb/:tmdbId', movieController.getMovieByTmdbId);
router.get('/tmdb/:tmdbId', movieController.getOrAddMovieByTmdbId);

module.exports = router;
