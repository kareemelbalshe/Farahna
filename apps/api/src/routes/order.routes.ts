import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/order.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', requireRole(['super_admin', 'admin', 'editor']), getOrders);
router.get('/:id', requireRole(['super_admin', 'admin', 'editor']), getOrderById);
router.post('/', requireRole(['super_admin', 'admin']), createOrder);
router.patch('/:id', requireRole(['super_admin', 'admin']), updateOrder);
router.patch('/:id/status', requireRole(['super_admin', 'admin']), updateOrderStatus);
router.delete('/:id', requireRole(['super_admin', 'admin']), deleteOrder);

export default router;
