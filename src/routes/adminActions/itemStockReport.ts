import { Router } from 'express';
import { prisma } from '../../utils';

const router = Router();

router.get('/', (req, res) => {
  prisma.item
    .findMany({
      select: {
        id: true,
        title: true,
        stock: true
      }
    })
    .then((items) => res.send(items))
    .catch((e) => res.status(500).send(e));
});

export default router;
