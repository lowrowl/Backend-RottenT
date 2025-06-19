const Comment = require('../models/Comment');
const Movie = require('../models/Movie');

exports.addComment = async (req, res) => {
  try {
    const { movieId, content, rating } = req.body;
    const userId = req.user.id;
    const isCritic = req.user.role === 'critic';


    const comment = new Comment({
      userId,
      movieId,
      content,
      rating,
      isCritic
    });

    await comment.save();

    // Recalcular promedios
    const allComments = await Comment.find({ movieId });

    const userComments = allComments.filter(c => !c.isCritic);
    const criticComments = allComments.filter(c => c.isCritic);

    const avgUser = userComments.length
      ? userComments.reduce((acc, c) => acc + c.rating, 0) / userComments.length
      : 0;

    const avgCritic = criticComments.length
      ? criticComments.reduce((acc, c) => acc + c.rating, 0) / criticComments.length
      : 0;

    await Movie.findByIdAndUpdate(movieId, {
      averageUserRating: avgUser.toFixed(1),
      averageCriticRating: avgCritic.toFixed(1)
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar comentario', error });
  }
};

exports.getCommentsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const comments = await Comment.find({ movieId }).populate('userId', 'username role');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios', error });
  }
};

exports.deleteComment = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      const comment = await Comment.findById(id);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comentario no encontrado' });
      }
  
      // Verificamos si el comentario pertenece al usuario autenticado
      if (comment.userId.toString() !== userId) {
        return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
      }
  
      await Comment.findByIdAndDelete(id);
  
      res.json({ message: 'Comentario eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar comentario', error });
    }
  };
