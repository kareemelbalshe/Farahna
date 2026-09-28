import { Router } from 'express';
import { createEvent, updateEvent, deleteEvent } from '../controllers/event.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { invitationEventSchema } from '@farahna/shared';

const router = Router();

router.use(authenticateJWT);

router.post('/', requireRole(['super_admin', 'admin', 'editor']), validateBody(invitationEventSchema), createEvent);
router.patch('/:id', requireRole(['super_admin', 'admin', 'editor']), updateEvent);
router.delete('/:id', requireRole(['super_admin', 'admin', 'editor']), deleteEvent);

export default router;
