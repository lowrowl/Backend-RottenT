const User   = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

/* ─────────── Auth ─────────── */
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'El correo ya está registrado' });

    const hashed = await bcrypt.hash(password, 10);

    await new User({
      username,
      email,
      passwordHash: hashed,
      role: role || 'user'
    }).save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (e) {
    res.status(500).json({ message: 'Error al registrar usuario', error: e });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)  return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: e });
  }
};

/* ─────────── Perfil básico ─────────── */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener el perfil', error: e });
  }
};

/* ─────────── Watchlist / MiLista ─────────── */
const addToWatchlist = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $addToSet: { watchlist: req.body.movieId } });
  res.json({ message: 'Película agregada a Ver más tarde' });
};

const addToMyList = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $addToSet: { myList: req.body.movieId } });
  res.json({ message: 'Película agregada a Mi Lista' });
};

/* GET  →  /api/users/watchlist  |  /api/users/seenlist */
const getWatchlist = async (req, res) => {
  const user = await User.findById(req.user.id).populate('watchlist');
  res.json(user?.watchlist || []);
};

const getSeenlist  = async (req, res) => {
  const user = await User.findById(req.user.id).populate('myList');
  res.json(user?.myList || []);
};

/* GET  →  /api/users/profile (todo junto) */
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('watchlist')
    .populate('myList')
    .select('-passwordHash');
  res.json(user);
};

const removeFromWatchlist = async (req, res) => {
  const { movieId } = req.body;
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { watchlist: movieId }
  });
  res.json({ message: 'Película eliminada de Ver más tarde' });
};

module.exports = {
  register,
  login,
  getMe,
  addToWatchlist,
  addToMyList,
  getWatchlist,
  getSeenlist,
  getProfile,
  removeFromWatchlist  // ✅ ← Agregado aquí
};
