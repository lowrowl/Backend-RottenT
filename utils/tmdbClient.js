const axios = require('axios');
const API_KEY = process.env.TMDB_API_KEY;

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
    language: 'es-ES'
  }
});

module.exports = tmdbClient;
