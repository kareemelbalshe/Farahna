import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export async function getPublicInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, slug } = req.params;

    const invitation = await prisma.invitation.findFirst({
      where: {
        slug,
        ...(type && type !== 'any' ? { type: type as any } : {}),
        isDeleted: null,
      },
      include: {
        theme: true,
        events: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
        },
        sections: {
          where: { isEnabled: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'عذراً، لم يتم العثور على الدعوة المطلوبة',
      });
    }

    // Check status: published vs draft/preview/paused/expired
    if (invitation.status === 'draft') {
      return res.status(403).json({
        success: false,
        status: 'draft',
        message: 'هذه الدعوة ما زالت قيد الإعداد ولم يتم نشرها بعد',
      });
    }

    if (invitation.status === 'paused') {
      return res.status(403).json({
        success: false,
        status: 'paused',
        message: 'تم إيقاف هذه الدعوة مؤقتاً بواسطة أصحاب المناسبة',
      });
    }

    if (invitation.status === 'expired' || (invitation.expiresAt && new Date() > invitation.expiresAt)) {
      return res.status(410).json({
        success: false,
        status: 'expired',
        message: 'انتهت صلاحية هذه الدعوة بعد انقضاء موعد الفرح المبارك ❤️',
      });
    }

    // Atomically increment views count
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { viewsCount: { increment: 1 } },
    });

    const settings = await prisma.settings.findFirst();

    // Sanitize output to remove any sensitive administrative data
    const publicData = {
      id: invitation.id,
      slug: invitation.slug,
      title: invitation.title,
      type: invitation.type,
      status: invitation.status,
      privacy: invitation.privacy,
      coupleGroomAr: invitation.coupleGroomAr,
      coupleBrideAr: invitation.coupleBrideAr,
      coupleGroomEn: invitation.coupleGroomEn,
      coupleBrideEn: invitation.coupleBrideEn,
      parentsGroomAr: invitation.parentsGroomAr,
      parentsBrideAr: invitation.parentsBrideAr,
      weddingMessageAr: invitation.weddingMessageAr,
      weddingMessageEn: invitation.weddingMessageEn,
      coverImageUrl: invitation.coverImageUrl,
      coupleImageUrl: invitation.coupleImageUrl,
      galleryImages: invitation.galleryImages,
      musicUrl: invitation.musicUrl,
      musicTitle: invitation.musicTitle,
      themeId: invitation.themeId,
      themeConfig: invitation.themeConfig,
      isMultiEvent: invitation.isMultiEvent,
      rsvpEnabled: invitation.rsvpEnabled,
      countdownEnabled: invitation.countdownEnabled,
      envelopeAnimationEnabled: invitation.envelopeAnimationEnabled,
      eventDate: invitation.eventDate,
      events: invitation.events,
      sections: invitation.sections,
      theme: invitation.theme,
      settings: {
        siteNameAr: settings?.siteNameAr || 'فرحنا',
        whatsappNumber: settings?.whatsappNumber || '201012345678',
      },
    };

    return res.json({
      success: true,
      data: publicData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPreviewInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { previewToken: token },
      include: {
        theme: true,
        events: {
          orderBy: { sortOrder: 'asc' },
        },
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!invitation || invitation.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'رابط المعاينة غير صالح أو منتهي الصلاحية',
      });
    }

    const settings = await prisma.settings.findFirst();

    return res.json({
      success: true,
      isPreview: true,
      data: {
        ...invitation,
        settings: {
          siteNameAr: settings?.siteNameAr || 'فرحنا',
          whatsappNumber: settings?.whatsappNumber || '201012345678',
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvitationRsvpSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const invitation = await prisma.invitation.findFirst({
      where: isUuid ? { id } : { slug: id },
      include: {
        sections: { where: { sectionKey: 'rsvp' } },
      },
    });

    if (!invitation) {
      return res.status(404).json({ success: false, message: 'الدعوة غير موجودة' });
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { invitationId: invitation.id },
      orderBy: { createdAt: 'desc' },
    });

    const attendingCount = rsvps.filter((r) => r.attendanceStatus === 'attending').length;
    const notAttendingCount = rsvps.filter((r) => r.attendanceStatus === 'not_attending').length;
    const maybeCount = rsvps.filter((r) => r.attendanceStatus === 'maybe').length;
    const totalGuests = rsvps
      .filter((r) => r.attendanceStatus === 'attending')
      .reduce((sum, r) => sum + (r.guestCount || 1), 0);

    const rsvpSection = invitation.sections?.[0];
    const isSectionActive = rsvpSection ? rsvpSection.isEnabled : true;

    return res.json({
      success: true,
      data: {
        invitationId: invitation.id,
        slug: invitation.slug,
        title: invitation.title,
        rsvpEnabled: invitation.rsvpEnabled && isSectionActive,
        totalResponses: rsvps.length,
        attendingCount,
        notAttendingCount,
        maybeCount,
        totalGuests,
        rsvps,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function submitRsvp(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, phone, attendanceStatus, guestCount, message, attendingEventIds } = req.body;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const invitation = await prisma.invitation.findFirst({
      where: isUuid ? { id } : { slug: id },
      include: {
        sections: { where: { sectionKey: 'rsvp' } },
      },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'عذراً، لم يتم العثور على الدعوة المطلوبة',
      });
    }

    const rsvpSection = invitation.sections?.[0];
    const isSectionActive = rsvpSection ? rsvpSection.isEnabled : true;
    if (!invitation.rsvpEnabled || !isSectionActive) {
      return res.status(400).json({
        success: false,
        message: 'تأكيد الحضور غير مفعّل حالياً لهذه الدعوة',
      });
    }

    // Backend validation: guest count for not_attending is 0, for attending/maybe is capped between 1 and 10
    const normalizedGuestCount =
      attendanceStatus === 'not_attending'
        ? 0
        : Math.max(1, Math.min(10, parseInt(guestCount, 10) || 1));

    const rsvp = await prisma.rSVP.create({
      data: {
        invitationId: invitation.id,
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        attendanceStatus,
        guestCount: normalizedGuestCount,
        message: message ? message.trim() : null,
        attendingEventIds: attendingEventIds || [],
      },
    });

    // Log analytics event for RSVP submission (fire-and-forget, privacy conscious)
    prisma.analyticsEvent.create({
      data: {
        invitationId: invitation.id,
        eventType: 'rsvp_submission',
        deviceType: 'mobile',
        browser: 'Guest Client',
        metadata: { attendanceStatus, guestCount: normalizedGuestCount },
      },
    }).catch(() => {});

    return res.status(201).json({
      success: true,
      data: rsvp,
      message: 'شكراً لكم! تم تسجيل تأكيد الحضور بنجاح ❤️',
    });
  } catch (error) {
    next(error);
  }
}

export async function recordAnalyticsEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { invitationId, eventType, deviceType, browser, referrer, metadata } = req.body;
    if (!invitationId) {
      return res.status(200).json({ success: false, message: 'Missing invitationId' });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(invitationId);
    let resolvedId = invitationId;
    if (!isUuid) {
      const found = await prisma.invitation.findFirst({
        where: { slug: invitationId },
        select: { id: true },
      });
      if (!found) {
        return res.status(200).json({ success: false, message: 'Invitation not found' });
      }
      resolvedId = found.id;
    }

    await prisma.analyticsEvent.create({
      data: {
        invitationId: resolvedId,
        eventType,
        deviceType: deviceType || 'mobile',
        browser: browser || 'Unknown',
        referrer: referrer || null,
        metadata: metadata || {},
      },
    });

    if (eventType === 'page_view') {
      await prisma.invitation.update({
        where: { id: resolvedId },
        data: {
          viewsCount: { increment: 1 },
          uniqueVisitorsCount: { increment: 1 },
        },
      }).catch(() => {});
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    // Analytics failures shouldn't break the client
    return res.status(200).json({ success: false });
  }
}

export async function getSitemapInvitations(req: Request, res: Response, next: NextFunction) {
  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        status: 'published',
        privacy: 'public', // Strictly indexable public invitations only
        isDeleted: null,
      },
      select: {
        type: true,
        slug: true,
        updatedAt: true,
      },
    });

    return res.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    next(error);
  }
}
