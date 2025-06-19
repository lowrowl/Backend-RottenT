const axios = require('axios');
const Movie = require('../models/Movie');
const BASE = 'https://api.themoviedb.org/3';

// 1. Buscar películas (search)
exports.searchTMDb = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Falta parámetro query' });

    const { data } = await axios.get(`${BASE}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'es-ES',
        query
      }
    });

    const results = data.results.map(m => ({
      tmdbId: m.id,
      title: m.title,
      posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      releaseDate: m.release_date,
      overview: m.overview
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar en TMDb', error });
  }
};

// 2. Populares
exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const { data } = await axios.get(`${BASE}/movie/popular`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'es-ES',
        page
      }
    });

    // Ahora vamos a enriquecer con ratings guardados en la BD
    const tmdbIds = data.results.map(m => m.id);

    // Buscar en BD las que ya tengas para sacar ratings
    const localMovies = await Movie.find({ tmdbId: { $in: tmdbIds } })
      .select('tmdbId averageUserRating averageCriticRating')
      .lean();

    const mapRatings = Object.fromEntries(
      localMovies.map(m => [m.tmdbId, {
        averageUserRating: m.averageUserRating,
        averageCriticRating: m.averageCriticRating
      }])
    );

    const results = data.results.map(m => ({
      tmdbId: m.id,
      title: m.title,
      posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      releaseDate: m.release_date,
      overview: m.overview,
      averageUserRating: mapRatings[m.id]?.averageUserRating ?? null,
      averageCriticRating: mapRatings[m.id]?.averageCriticRating ?? null
    }));

    res.json(results);
  } catch (error) {
    console.error('Error en getPopularMovies:', error);
    res.status(500).json({ message: 'Error al obtener películas populares de TMDb', error });
  }
};
