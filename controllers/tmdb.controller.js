const axios = require('axios');
const BASE = 'https://api.themoviedb.org/3';

/* 1. Buscar por nombre */
exports.searchTMDb = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Falta el parámetro \"query\"' });
    }

    const { data } = await axios.get(`${BASE}/search/movie`, {
      params: {
        api_key : process.env.TMDB_API_KEY,   // ← se lee aquí
        query,
        language: 'es-ES'
      }
    });

    const results = data.results.map(m => ({
      tmdbId: m.id,
      title: m.title,
      releaseDate: m.release_date,
      posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      overview: m.overview
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar en TMDb', error });
  }
};

/* 2. Populares para el Home */
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
