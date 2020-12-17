import { AuthenticateOptions } from 'passport';
import { IStrategyOptions } from 'passport-local';
import {
  ExtractJwt,
  JwtFromRequestFunction,
  StrategyOptions
} from 'passport-jwt';
import { JWE, JWT } from 'jose';

export const JwtSignSecret =
  process.env.JWT_SIGN_SECRET || 'asdf;kljqwerpm!@#$%';
export const JwtEncSecret = process.env.JWT_ENC_SECRET || 'asdf;kljqwerpm!@#$%';

const JwtExtractor: JwtFromRequestFunction = (req) => {
  let jwetoken: string | null = null,
    jwttoken: string | null = null;
  const bearerExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwetoken = bearerExtractor(req);
  try {
    if (jwetoken) jwttoken = JWE.decrypt(jwetoken, JwtEncSecret).toString();
  } catch (err) {
    console.log(err);
  }
  return jwttoken;
};

export const LocalOptions: IStrategyOptions = {
  usernameField: 'emailphone',
  passwordField: 'password'
};

export const JwtSignOptions: JWT.SignOptions = {
  algorithm: 'HS512',
  expiresIn: '30m'
};

export const JWTOptions: StrategyOptions = {
  jwtFromRequest: JwtExtractor,
  algorithms: ['HS512'],
  ignoreExpiration: false,
  secretOrKey: JwtSignSecret
};

export const passportAuthenticateOptions: AuthenticateOptions = {
  session: false
};
