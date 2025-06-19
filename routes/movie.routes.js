const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const auth = require('../middleware/auth');

// ───── Rutas TMDb ─────
router.get('/tmdb/:tmdbId', movieController.getOrAddMovieByTmdbId); // <- ÚNICA y antes que '/:id'
router.post('/tmdb/:tmdbId', auth, movieController.addMovieByTMDbId);

// ───── CRUD local ─────
router.get('/', movieController.getAllMovies);        // lista/filtra
router.post('/', auth, movieController.addMovie);     // alta manual

router.get('/:id', movieController.getMovieById);     // detalle por _id de Mongo

module.exports = router;
