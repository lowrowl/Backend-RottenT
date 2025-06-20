const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/user.controller');
const auth    = require('../middleware/auth');

/* auth público */
router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);

/* auth protegido */
router.get('/me',       auth, ctrl.getMe);         // sólo datos básicos
router.get('/profile',  auth, ctrl.getProfile);    // + listas pobladas

router.post('/watchlist', auth, ctrl.addToWatchlist); // body: { movieId }
router.post('/mylist',    auth, ctrl.addToMyList);    // body: { movieId }

module.exports = router;
