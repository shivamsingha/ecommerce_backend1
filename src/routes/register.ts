import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { emailCodeGen, hostname, mailTransporter, prisma } from '../utils';

const router = Router();

router.post(
  '/',
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('any'),
  body('password').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0
  }),
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send(error);
    }
    console.log(req.body);
    const { email, phone, password } = req.body;
    prisma.user
      .create({
        data: {
          email,
          phone,
          password
        },
        select: {
          id: true,
          email: true,
          verified: true
        }
      })
      .then((user) => {
        prisma.emailVerify
          .create({
            data: {
              verifyCode: emailCodeGen(),
              user: {
                connect: { id: user.id }
              }
            }
          })
          .then((x) => {
            console.log('verify created', x);
            mailTransporter.sendMail({
              to: user.email,
              subject: 'Verify your email address',
              html: `<a href="http://${hostname}/${user.id}/${x.verifyCode}">Click here to verify email</a>`
            });
            res.status(200).send();
          })
          .catch((e) => console.log('verify create error', e));
      })
      .catch((e) => {
        console.log('user create error', e);
        res.status(500).send(e);
      });
  }
);

export default router;
