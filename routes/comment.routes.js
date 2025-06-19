const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addComment,
  getCommentsByMovie,
  deleteComment
} = require('../controllers/comment.controller');

// ✅ Protegida con auth
router.post('/', auth, addComment);

// No necesita login
router.get('/movie/:movieId', getCommentsByMovie);

// Puedes proteger esta si lo deseas
router.delete('/:id', auth, deleteComment);

module.exports = router;
