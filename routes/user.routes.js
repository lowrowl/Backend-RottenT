const express = require('express');
const router = express.Router();
const { register, login, getMe, getSeenlist, getWatchlist } = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// Registro y login
router.post('/register', register);
router.post('/login', login);

// 👤 Obtener usuario autenticado
router.get('/profile', auth, getMe);
router.get('/watchlist', auth, getWatchlist);
router.get('/seenlist', auth, getSeenlist);

module.exports = router;
