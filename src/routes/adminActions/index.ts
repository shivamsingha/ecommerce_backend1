import { RequestHandler, Router } from 'express';
import saleReport from './saleReport';
import userLoginReport from './userLoginReport';
import { prisma } from '../../utils';

const router = Router();

const checkAdmin: RequestHandler = (req, res, next) => {
  const userId = req.user as number;
  prisma.user
    .findUnique({
      where: { id: userId },
      select: { role: true }
    })
    .then((user) => {
      if (user?.role == 'admin') next();
      else res.status(403).send();
    });
};

router.use(checkAdmin);
router.use('/saleReport', saleReport);
router.use('/userLoginReport', userLoginReport);

export default router;
