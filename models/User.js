const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:      { type: String, required: true, unique: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  passwordHash:  { type: String, required: true },
  role:          { type: String, enum: ['user', 'critic'], default: 'user' },

  /* ★ nuevas listas ↓ */
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  myList:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);