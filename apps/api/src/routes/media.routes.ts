import { Router } from 'express';
import {
  uploadMiddleware,
  uploadMedia,
  servePublicMedia,
  serveSecureMedia,
  getInvitationMedia,
  getAllMedia,
  deleteMedia,
} from '../controllers/media.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// 1. Public static serving (covers, gallery, themes, music - BLOCKS payment proofs)
router.get('/public/*', servePublicMedia);

// 2. Secure static serving (Payment proofs: REQUIRES super_admin or admin)
router.get('/secure/*', authenticateJWT, requireRole(['super_admin', 'admin']), serveSecureMedia);

// 3. Public get media for an invitation
router.get('/invitation/:invitationId', getInvitationMedia);

// 4. Authenticated upload & list & delete operations
router.use(authenticateJWT);
router.get('/', requireRole(['super_admin', 'admin', 'editor']), getAllMedia);
router.post('/upload', requireRole(['super_admin', 'admin', 'editor']), uploadMiddleware, uploadMedia);
router.delete('/:id', requireRole(['super_admin', 'admin', 'editor']), deleteMedia);

export default router;
