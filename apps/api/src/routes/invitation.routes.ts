import { Router } from 'express';
import {
  getInvitations,
  getInvitationById,
  createInvitation,
  updateInvitation,
  publishInvitation,
  pauseInvitation,
  duplicateInvitation,
  softDeleteInvitation,
} from '../controllers/invitation.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { invitationSchema } from '@farahna/shared';

const router = Router();

router.use(authenticateJWT);

router.get('/', requireRole(['super_admin', 'admin', 'editor']), getInvitations);
router.get('/:id', requireRole(['super_admin', 'admin', 'editor']), getInvitationById);
router.post('/', requireRole(['super_admin', 'admin', 'editor']), validateBody(invitationSchema), createInvitation);
router.patch('/:id', requireRole(['super_admin', 'admin', 'editor']), updateInvitation);
router.delete('/:id', requireRole(['super_admin', 'admin']), softDeleteInvitation);

// Workflow actions
router.post('/:id/publish', requireRole(['super_admin', 'admin']), publishInvitation);
router.post('/:id/pause', requireRole(['super_admin', 'admin']), pauseInvitation);
router.post('/:id/duplicate', requireRole(['super_admin', 'admin', 'editor']), duplicateInvitation);

export default router;
