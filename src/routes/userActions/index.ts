import { Router } from 'express';
import addToCart from './addToCart';
import checkout from './checkout';
import editProfile from './editProfile';
import payment from './payment';

const router = Router();

router.use('/addToCart', addToCart);
router.use('/checkout', checkout);
router.use('/editProfile', editProfile);
router.use('/payment', payment);

export default router;
