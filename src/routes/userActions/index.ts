import { Router } from 'express';
import addToCart from './addToCart';

const router = Router();

router.use('/addToCart', addToCart);

export default router;
