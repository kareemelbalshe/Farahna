import { Router } from 'express';
import {
  getPayments,
  recordPayment,
  verifyPayment,
  rejectPayment,
  updatePayment,
} from '../controllers/payment.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { paymentSchema, verifyPaymentSchema } from '@farahna/shared';

const router = Router();

router.use(authenticateJWT);

// Only super_admin and admin can access payments (editor is rejected)
router.get('/', requireRole(['super_admin', 'admin']), getPayments);
router.post('/', requireRole(['super_admin', 'admin']), validateBody(paymentSchema), recordPayment);
router.patch('/:id', requireRole(['super_admin', 'admin']), updatePayment);
router.patch('/:id/verify', requireRole(['super_admin', 'admin']), validateBody(verifyPaymentSchema), verifyPayment);
router.patch('/:id/reject', requireRole(['super_admin', 'admin']), rejectPayment);

export default router;
