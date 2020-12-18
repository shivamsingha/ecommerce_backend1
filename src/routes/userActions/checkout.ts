import { Router } from 'express';
import { prisma } from '../../utils';

const router = Router();

router.post('/', (req, res) => {
  const userId = req.user as number;
  prisma.user
    .findUnique({
      where: { id: userId },
      select: {
        profile: {
          select: {
            cart: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })
    .then((cart) =>
      prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            upsert: {
              create: {
                orders: {
                  create: {
                    items: {
                      connect:
                        cart?.profile?.cart.map((c) => ({ id: c.id })) || []
                    }
                  }
                }
              },
              update: {
                orders: {
                  create: {
                    items: {
                      connect:
                        cart?.profile?.cart.map((c) => ({ id: c.id })) || []
                    }
                  }
                }
              }
            }
          }
        }
      }).then(()=>res.send())
    .catch((e) => res.status(500).send(e));
});

export default router;
