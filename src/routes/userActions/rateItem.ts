import { Router } from 'express';
import { prisma } from '../../utils';

const router = Router();

router.post('/:itemId', (req, res) => {
  const { rating }: { rating: number } = req.body;
  const itemId = parseInt(req.params.itemId);
  prisma.item
    .update({
      where: { id: itemId },
      data: {
        noOfRatings: {
          increment: 1
        },
        totalScore: {
          increment: rating
        }
      }
    })
    .then(() => res.status(200).send())
    .catch((e) => res.status(500).send(e));
});

export default router;
