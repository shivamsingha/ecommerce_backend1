import { Router } from 'express';
import { prisma } from '../../utils';

const router = Router();

function objCon(name: string, address: string) {
  if (name && address) return { name, address };
  if (name) return { name };
  if (address) return { address };
  return {};
}

router.post('/:userId', (req, res) => {
  const userId = req.user as number;
  const { name, address }: { name: string; address: string } = req.body;
  prisma.user
    .update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              name,
              address
            },
            update: objCon(name, address)
          }
        }
      },
      select: {
        profile: true
      }
    })
    .then((u) => res.send(u))
    .catch((e) => res.status(500).send(e));
});

export default router;
