import { Router } from 'express';
import {
  getPublicInvitation,
  getPreviewInvitation,
  getInvitationRsvpSummary,
  submitRsvp,
  recordAnalyticsEvent,
  getSitemapInvitations,
} from '../controllers/public.controller';
import { validateBody } from '../middleware/validate';
import { rsvpRateLimiter } from '../middleware/auth';
import { rsvpSubmissionSchema, analyticsEventSchema } from '@farahna/shared';

const router = Router();

// 1. Sitemap indexable invitations (Must be before wildcard!)
router.get('/sitemap-invitations', getSitemapInvitations);

// 2. RSVP Endpoints (Must be before :type/:slug wildcard!)
router.get('/invitations/:id/rsvp', getInvitationRsvpSummary);
router.post('/invitations/:id/rsvp', rsvpRateLimiter, validateBody(rsvpSubmissionSchema), submitRsvp);

// 3. Guest public views
router.get('/invitations/:type/:slug', getPublicInvitation);
router.get('/preview/:token', getPreviewInvitation);

// 4. Guest actions
router.post('/analytics', validateBody(analyticsEventSchema), recordAnalyticsEvent);

export default router;
