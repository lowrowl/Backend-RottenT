const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/user.controller');
const auth    = require('../middleware/auth');

/* Auth */
router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);

/* Perfil básico */
router.get('/me',      auth, ctrl.getMe);
router.get('/profile', auth, ctrl.getProfile);

/* Watch-/My-list */
router.post('/watchlist', auth, ctrl.addToWatchlist);
router.post('/mylist',    auth, ctrl.addToMyList);

router.get('/watchlist', auth, ctrl.getWatchlist);
router.get('/seenlist',  auth, ctrl.getSeenlist);

module.exports = router;
