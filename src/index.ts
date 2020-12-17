import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import csrf, { CookieOptions } from 'csurf';
import bodyParser from 'body-parser';
import helmet, { IHelmetConfiguration } from 'helmet';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import { Passport, passportAuthenticateOptions } from './utils';
import {
  adminActions,
  item,
  login,
  register,
  userActions,
  verification
} from './routes';

const csrfCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict'
};

const corsOptions: CorsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true
};

const helmetConfig: IHelmetConfiguration = {
  frameguard: {
    action: 'deny'
  },
  permittedCrossDomainPolicies: true,
  referrerPolicy: {
    policy: 'no-referrer'
  }
};

const app = express();
const csrfProtection = csrf({ cookie: csrfCookieOptions });
const passport = new Passport().usePassport();

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  console.log(err);
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403);
  res.send();
};

app.use(helmet(helmetConfig));
app.use(passport.initialize());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(morgan('combined'));

app.get('/', csrfProtection, (req, res) => {
  res.send({ 'CSRF-Token': req.csrfToken() });
});

app.post(
  '/',
  csrfProtection,
  passport.authenticate('jwt', passportAuthenticateOptions),
  (_, res) => {
    res.send('ok');
  }
);

app.use('/login', csrfProtection, login);
app.use('/register', csrfProtection, register);
app.use('/verify', verification);

app.use('/item', item);

app.use(
  '/user',
  csrfProtection,
  passport.authenticate('jwt', passportAuthenticateOptions),
  userActions
);
app.use(
  '/admin',
  csrfProtection,
  passport.authenticate('jwt', passportAuthenticateOptions),
  adminActions
);

app.use(errorHandler);
app.listen(3000, () => console.log(`Listening on port 3000`));
