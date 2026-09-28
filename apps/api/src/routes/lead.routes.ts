import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLeadStatus,
  convertLeadToCustomer,
  deleteLead,
} from '../controllers/lead.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { leadSchema } from '@farahna/shared';

const router = Router();

// Public creation for potential landing inquiries
router.post('/public', validateBody(leadSchema), createLead);

// Admin-only management
router.use(authenticateJWT);
router.get('/', requireRole(['super_admin', 'admin', 'editor']), getLeads);
router.get('/:id', requireRole(['super_admin', 'admin', 'editor']), getLeadById);
router.post('/', requireRole(['super_admin', 'admin']), validateBody(leadSchema), createLead);
router.patch('/:id', requireRole(['super_admin', 'admin']), updateLeadStatus);
router.post('/:id/convert', requireRole(['super_admin', 'admin']), convertLeadToCustomer);
router.delete('/:id', requireRole(['super_admin', 'admin']), deleteLead);

export default router;
