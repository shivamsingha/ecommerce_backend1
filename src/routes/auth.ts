import { Router } from 'express';
import { JWE, JWT } from 'jose';
import passport from 'passport';
import {
  JwtEncSecret,
  JwtSignOptions,
  JwtSignSecret,
  passportAuthenticateOptions
} from '../utils';

const router = Router();

router.post('/', (req, res) => {
  passport.authenticate('local', passportAuthenticateOptions, (err, user) => {
    if (err || !user) return res.status(403).send();

    req.login(user, passportAuthenticateOptions, (err) => {
      if (err) return res.status(403).send();

      const token = JWE.encrypt(
        JWT.sign({ userId: user }, JwtSignSecret, JwtSignOptions),
        JwtEncSecret
      );
      return res.json({ token });
    });
  })(req, res);
});

export default router;
