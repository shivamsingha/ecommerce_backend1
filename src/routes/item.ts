import { Router } from 'express';
import { prisma } from '../utils';

const router = Router();

router.get('/:itemId', async (req, res) => {
  const item = await prisma.item
    .findUnique({
      where: {
        id: parseInt(req.params.itemId)
      },
      select: {
        title: true,
        desc: true,
        price: true,
        noOfRatings: true,
        totalScore: true
      }
    })
    .catch((e) => res.status(500).send(e));
  if (item) return res.json(item);
  return res.send(404);
});

export default router;
