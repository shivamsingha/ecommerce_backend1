import { Router } from 'express';
import { prisma } from '../../utils';

const router = Router();

router.get('/', (req, res) => {
  prisma.userLog
    .findMany()
    .then((log) => res.send(log))
    .catch((e) => res.status(500).send(e));
});

export default router;
