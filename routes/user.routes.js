const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// Registro y login
router.post('/register', register);
router.post('/login', login);

// 👤 Obtener usuario autenticado
router.get('/me', auth, getMe);

module.exports = router;
