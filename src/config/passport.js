import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const SECRET = 'jwtsecret';

const initializePassport = () => {

  console.log("Passport inicializado");

  // =========================
  // LOGIN
  // =========================
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          console.log("Email recibido:", email);

          const user = await User.findOne({ email });
          console.log("Usuario encontrado:", user);

          if (!user) return done(null, false);

          const isValid = bcrypt.compareSync(password, user.password);
          console.log("Password válido:", isValid);

          if (!isValid) return done(null, false);

          return done(null, user);

        } catch (error) {
          return done(error);
        }
      }
    )
  );
console.log("User import:", User);
  // =========================
  // JWT
  // =========================
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET
      },
      async (jwt_payload, done) => {
        try {
          const user = await User
            .findById(jwt_payload.user._id)
            .select('-password');

          if (!user) return done(null, false);

          return done(null, user);

        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

export default initializePassport;