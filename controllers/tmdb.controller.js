// src/controllers/tmdb.controller.js
const axios = require('axios');
const Movie = require('../models/Movie');     // ✅ 1) importar modelo
const BASE  = 'https://api.themoviedb.org/3';

exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;

    /* ── ❶ Llamada a TMDb ───────────────────────────── */
    const { data } = await axios.get(`${BASE}/movie/popular`, {
      params: {
        api_key : process.env.TMDB_API_KEY,
        language: 'es-ES',
        page
      }
    });

    /* ── ❷ Combinar con tu DB ───────────────────────── */
    const results = await Promise.all(
      data.results.map(async (m) => {
        const local = await Movie.findOne({ tmdbId: m.id });

        return {
          tmdbId: m.id,
          title:  m.title,
          releaseDate: m.release_date,
          posterUrl:   m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          overview:    m.overview,
          averageUserRating:   local?.averageUserRating   ?? null,
          averageCriticRating: local?.averageCriticRating ?? null
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error('Error populares:', error.message);
    res.status(500).json({ message: 'Error al obtener películas populares de TMDb', error });
  }
};
