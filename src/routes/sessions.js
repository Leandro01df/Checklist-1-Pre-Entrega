import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { SECRET } from '../config/passport.js';

const router = Router();

/* =========================
   REGISTER
========================= */
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // validar campos
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // validar email duplicado
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hash
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        _id: user._id,
        first_name,
        last_name,
        email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

/* =========================
   LOGIN
========================= */
router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  (req, res) => {
    // Armar payload limpio
    const user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role
    };

    const token = jwt.sign({ user }, SECRET, { expiresIn: '1h' });

    res.json({ token });
  }
);

/* =========================
   CURRENT
========================= */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

export default router;
