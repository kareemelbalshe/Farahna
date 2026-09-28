import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  softDeleteCustomer,
} from '../controllers/customer.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { customerSchema } from '@farahna/shared';

const router = Router();

router.use(authenticateJWT);

router.get('/', requireRole(['super_admin', 'admin', 'editor']), getCustomers);
router.get('/:id', requireRole(['super_admin', 'admin', 'editor']), getCustomerById);
router.post('/', requireRole(['super_admin', 'admin']), validateBody(customerSchema), createCustomer);
router.patch('/:id', requireRole(['super_admin', 'admin']), updateCustomer);
router.delete('/:id', requireRole(['super_admin', 'admin']), softDeleteCustomer);

export default router;
