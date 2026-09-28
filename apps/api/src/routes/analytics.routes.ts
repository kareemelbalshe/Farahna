import { Router } from 'express';
import {
  getDashboardStats,
  getInvitationAnalytics,
  getBusinessFunnel,
} from '../controllers/analytics.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/dashboard', requireRole(['super_admin', 'admin', 'editor']), getDashboardStats);
router.get('/funnel', requireRole(['super_admin', 'admin', 'editor']), getBusinessFunnel);
router.get('/invitation/:invitationId', requireRole(['super_admin', 'admin', 'editor']), getInvitationAnalytics);
router.get('/:invitationId', requireRole(['super_admin', 'admin', 'editor']), getInvitationAnalytics);

export default router;
