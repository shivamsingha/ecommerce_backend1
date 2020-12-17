import { Router } from 'express';
import { prisma } from '../../utils';

const router = Router();

router.post('/:itemId', (req, res) => {
  const userId = req.user as number;
  prisma.item
    .findUnique({
      where: {
        id: parseInt(req.params.itemId)
      },
      select: {
        id: true
      }
    })
    .then((item) => {
      if (item) {
        return prisma.user.update({
          where: { id: userId },
          data: {
            profile: {
              upsert: {
                create: {
                  cart: {
                    connect: {
                      id: item.id
                    }
                  }
                },
                update: {
                  cart: {
                    connect: {
                      id: item.id
                    }
                  }
                }
              }
            }
          },
          select: {
            profile: {
              select: {
                cart: true
              }
            }
          }
        });
      }
    })
    .then((u) => res.send(u))
    .catch((e) => res.status(500).send(e));
});

export default router;
