import { Router } from 'express';
import { prisma } from '../../utils';

const router = Router();

type Item = {
  title: string;
  price: number;
  desc: string;
  stock: number;
};

router.post('/', (req, res) => {
  const { title, stock, price, desc }: Item = req.body;
  prisma.item
    .create({
      data: {
        title,
        stock,
        price,
        desc
      }
    })
    .then((items) => res.send(items))
    .catch((e) => res.status(500).send(e));
});

export default router;
