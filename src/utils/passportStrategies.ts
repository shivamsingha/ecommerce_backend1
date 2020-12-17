import passport, { PassportStatic } from 'passport';
import {
  Strategy as LocalStrategy,
  VerifyFunction as LocalVerifyFunction
} from 'passport-local';
import {
  Strategy as JWTStrategy,
  VerifyCallback as JWTVerifyCallback
} from 'passport-jwt';
import { JWTOptions, LocalOptions } from './passportConfig';
import prisma from './prismaInstance';

class Passport {
  constructor() {
    this.LocalStrategy = new LocalStrategy(LocalOptions, this.LocalVerify);
    this.JWTStrategy = new JWTStrategy(JWTOptions, this.JWTverify);
  }
  LocalStrategy: LocalStrategy;
  JWTStrategy: JWTStrategy;

  LocalVerify: LocalVerifyFunction = async (emailphone, password, done) => {
    let user = await prisma.user.findUnique({
      where: {
        email: emailphone
      },
      select: {
        password: true,
        verified: true
      }
    });
    if (!user) {
      user = await prisma.user.findUnique({
        where: {
          phone: emailphone
        },
        select: {
          password: true,
          verified: true
        }
      });
    }
    if (user) {
      if (password == user.password && user.verified)
        return done(null, emailphone);
      return done(null, false);
    }
    return done(null, false);
  };

  JWTverify: JWTVerifyCallback = (payload, done) =>
    payload.userId ? done(null, payload.userId) : done(null, false);

  usePassport = (): PassportStatic => {
    passport.use(this.LocalStrategy);
    passport.use(this.JWTStrategy);
    return passport;
  };
}

export default Passport;
