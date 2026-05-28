import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

export function paymentRoutes(controller: PaymentController): Router {
  const router = Router();
  router.get('/', controller.summary);
  return router;
}
