const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const tmdbRoutes = require('./routes/tmdb.routes');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // para parsear application/json
app.use(express.urlencoded({ extended: true }));

// Rutas
const userRoutes = require('./routes/user.routes');
const movieRoutes = require('./routes/movie.routes');
const commentRoutes = require('./routes/comment.routes');

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tmdb', tmdbRoutes);

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en puerto ${PORT}`);
});
