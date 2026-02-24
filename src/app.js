import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import sessionRoutes from './routes/sessions.js';
import userRoutes from './routes/users.js';
import initializePassport from './config/passport.js';

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());

initializePassport();
app.use(passport.initialize());

/* =========================
   DATABASE
========================= */
mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));

/* =========================
   ROUTES
========================= */
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);

/* =========================
   SERVER
========================= */
app.listen(8080, () => console.log('Server running on port 8080'));