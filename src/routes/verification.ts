import { Router } from 'express';
import { prisma } from '../utils';

const router = Router();

router.get('/:userId/:code', (req, res) => {
  const { userId, code } = req.params;
  prisma.emailVerify
    .findFirst({
      where: {
        verifyCode: code,
        userId: parseInt(userId)
      }
    })
    .then((verify) => {
      if (!verify) {
        res.status(404);
      } else {
        return prisma.user.update({
          where: {
            id: verify.userId
          },
          data: {
            verified: true
          },
          select: {
            EmailVerify: {
              where: {
                verifyCode: code
              },
              select: {
                id: true
              }
            }
          }
        });
      }
    })
    .then((code) =>
      prisma.emailVerify.delete({
        where: {
          id: code?.EmailVerify[0].id
        }
      })
    )
    .then(() => res.status(200).send())
    .catch((e) => res.status(500).send(e));
});

export default router;
