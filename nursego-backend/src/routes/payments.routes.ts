import { Router } from 'express';
// Trigger Render Deployment
import { createOrder, verifyPayment } from '../controllers/payments.controller';

const router = Router();

router.post('/create-order', createOrder as any);
router.post('/verify', verifyPayment as any);

export default router;
