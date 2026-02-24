import { Router } from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = Router();

// POST ALL USERS
import bcrypt from 'bcrypt';

// CREATE USER
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Verificar si ya existe el email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    // Hashear contraseña
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: {
        ...newUser._doc,
        password: undefined
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// GET ALL USERS
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }
);

// GET USER BY ID
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar usuario' });
    }
  }
);

// UPDATE USER
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }
);

// DELETE USER
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
);

export default router;