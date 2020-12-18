import { Router } from 'express';
import { prisma } from '../../utils';

const router = Router();

router.get('/', (req, res) => {
  prisma.order
    .findMany({
      where: {
        status: true
      }
    })
    .then((orders) => res.send(orders))
    .catch((e) => res.status(500).send(e));
});

export default router;
