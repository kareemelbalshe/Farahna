import { Router } from 'express';
import {
  getPricingPlans,
  updatePricingPlan,
  bulkUpdatePricingPlans,
} from '../controllers/pricing-plan.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// 1. Public: get all active plans and current prices
router.get('/', getPricingPlans);

// 2. Admin: Update plan prices & details
router.use(authenticateJWT);
router.patch('/bulk', requireRole(['super_admin', 'admin']), bulkUpdatePricingPlans);
router.patch('/:idOrSlug', requireRole(['super_admin', 'admin']), updatePricingPlan);
router.put('/:idOrSlug', requireRole(['super_admin', 'admin']), updatePricingPlan);

export default router;
