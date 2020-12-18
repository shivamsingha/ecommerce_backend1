import { Router } from 'express';
import { mailTransporter, prisma } from '../../utils';

const router = Router();

function paymentProcessorConfim(): boolean {
  return true;
}

router.post('/:orderId', (req, res) => {
  const orderId: number = parseInt(req.params.orderId);
  const userId = req.user as number;
  let orderStatus: boolean;
  prisma.order
    .update({
      where: {
        id: orderId
      },
      data: {
        status: paymentProcessorConfim()
      },
      select: {
        status: true
      }
    })
    .then((order) => {
      orderStatus = order.status;
      return prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          email: true
        }
      });
    })
    .then((user) =>
      mailTransporter.sendMail({
        to: user?.email,
        subject: `Payment ${orderStatus ? 'successful' : 'failed'}`,
        text: `Payment for ${orderId} ${orderStatus ? 'successful' : 'failed'}`
      })
    )
    .then(() => {
      res.send(orderStatus);
    })
    .catch((e) => res.status(500).send(e));
});

export default router;
