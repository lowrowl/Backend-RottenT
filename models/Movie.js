const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: String,
  description: String,
  releaseDate: String,
  categories: {
    type: [String],
    default: []
  },
  cast: [String],
  posterUrl: String,
  averageUserRating: {
    type: Number,
    default: 0
  },
  averageCriticRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
