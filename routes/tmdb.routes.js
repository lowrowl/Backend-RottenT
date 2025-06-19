const express = require('express');
const router = express.Router();
const tmdb = require('../controllers/tmdb.controller');

router.get('/search', tmdb.searchTMDb);       // ?query=batman
router.get('/popular', tmdb.getPopularMovies); //  lista popular

module.exports = router;
