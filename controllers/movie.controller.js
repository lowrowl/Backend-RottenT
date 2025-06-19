const Movie = require('../models/Movie');
const tmdbClient = require('../utils/tmdbClient');

// Obtener todas las películas
exports.getAllMovies = async (req, res) => {
  try {
    const { title, category, sortBy } = req.query;

    let filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Búsqueda por nombre (insensible a mayúsculas)
    }
    if (category) {
      filter.categories = { $in: [category] }; // Buscar si incluye la categoría
    }

    let sortOptions = {};
    if (sortBy === 'date') {
      sortOptions.releaseDate = -1; // Más recientes primero
    } else if (sortBy === 'rating') {
      sortOptions.averageUserRating = -1; // Mayor puntuación primero
    }

    const movies = await Movie.find(filter).sort(sortOptions);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener películas', error });
  }
};


// Obtener una película por ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la película', error });
  }
};

// Agregar película manualmente (opcional, temporal)
exports.addMovie = async (req, res) => {
  try {
    const { title, releaseDate, posterUrl, overview } = req.body;

    const newMovie = new Movie({
      title,
      releaseDate,
      posterUrl,
      overview
    });

    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar película', error });
  }
};

exports.addMovieByTMDbId = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    // ── 1) Llamada a TMDb con credits incluidos ──
    const { data } = await tmdbClient.get(`/movie/${tmdbId}`, {
      params: { append_to_response: 'credits', language: 'es-ES' }
    });

    // ── 2) Construir la película ──
    const newMovie = new Movie({
      tmdbId: data.id,
      title: data.title,
      description: data.overview,
      releaseDate: data.release_date,
      categories: data.genres.map(g => g.name),                // <── géneros
      cast: data.credits.cast.slice(0, 5).map(a => a.name),    // <── reparto (top-5)
      posterUrl: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : null
    });

    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    // Mensaje de 404 de TMDb más claro
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Película no encontrada en TMDb' });
    }
    res.status(500).json({ message: 'Error al agregar película desde TMDb', error });
  }
};


exports.getMovieByTmdbId = async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.tmdbId });
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar película por tmdbId', error });
  }
};

exports.getOrAddMovieByTmdbId = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    // Verificar si ya está en la base de datos
    let movie = await Movie.findOne({ tmdbId });

    if (!movie) {
      // Obtener desde TMDb
      const response = await tmdbClient.get(`/movie/${tmdbId}`, {
        params: { append_to_response: 'credits' }
      });

      const { title, release_date, poster_path, overview, genres, credits } = response.data;

      movie = new Movie({
        tmdbId,
        title,
        releaseDate: release_date,
        posterUrl: `https://image.tmdb.org/t/p/w500${poster_path}`,
        description: overview,
        categories: genres.map(g => g.name),
        cast: credits.cast.slice(0, 5).map(c => c.name)
      });

      await movie.save();
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener o guardar película', error });
  }
};
