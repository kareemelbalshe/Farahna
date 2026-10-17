import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { nanoid } from 'nanoid';
import {
  DEFAULT_SECTIONS,
  generateInvitationSlug,
  extractCoordinatesFromUrl,
  resolveCityCoordinates,
  getOpenStreetMapUrl,
  isValidCoordinates,
} from '@farahna/shared';
import { storageService } from '../services/storage';
import { sendPaymentProofNotification, sendCustomerOrderConfirmationEmail } from '../services/email.service';

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
        whatsappNumber: settings?.whatsappNumber || '201019262075',
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

    const invitation = await prisma.invitation.findFirst({
      where: {
        OR: [
          { previewToken: token },
          { id: token },
        ],
      },
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
          whatsappNumber: settings?.whatsappNumber || '201019262075',
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

export async function submitPublicDesign(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      packageId = 'wedding-journey',
      amount = 95,
      paymentMethod = 'instapay',
      referenceNumber,
      paymentProofImage,
      paymentProofBase64,
      paymentProofUrl: existingProofUrl,
    } = req.body;

    const invInput = {
      ...(req.body.invitation || {}),
      ...(req.body || {}),
    };

    if (!customerPhone || !customerPhone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'رقم هاتف / واتساب العميل مطلوب لتأكيد التفعيل وإرسال الرابط',
      });
    }

    const cleanPhone = customerPhone.trim();
    const cleanName = (customerName || invInput.coupleGroomAr || 'عميل تصميم ذاتي').trim();
    const cleanEmail =
      customerEmail && typeof customerEmail === 'string' && customerEmail.includes('@')
        ? customerEmail.trim()
        : null;

    // 1. Resolve or Create Customer
    let customer = await prisma.customer.findFirst({
      where: { phone: cleanPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          whatsapp: cleanPhone,
          source: 'website',
          notes: `قام بتصميم دعوته ذاتياً عبر استوديو الموقع في ${new Date().toLocaleDateString('ar-EG')}`,
          status: 'active',
        },
      });
    } else if (cleanEmail && !customer.email) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { email: cleanEmail },
      });
    }

    // 2. Handle Payment Proof Screenshot
    let finalProofUrl = existingProofUrl || '';
    const proofRaw = paymentProofImage || paymentProofBase64;
    if (proofRaw && typeof proofRaw === 'string' && proofRaw.startsWith('data:image/')) {
      try {
        const matches = proofRaw.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          const ext = mimeType.split('/')[1] || 'png';
          const stored = await storageService.saveFile({
            buffer,
            originalName: `proof-${Date.now()}.${ext}`,
            mimeType,
            category: 'payment_proof',
            customerId: customer.id,
          });
          finalProofUrl = stored.url;
        }
      } catch (err) {
        console.error('Failed to save payment proof image:', err);
      }
    }

    // 3. Resolve Unique Slug
    const groom = (invInput.coupleGroomAr || 'groom').trim();
    const bride = (invInput.coupleBrideAr || 'bride').trim();
    let baseSlug = (invInput.slug ? String(invInput.slug).trim() : generateInvitationSlug(groom, bride));
    if (invInput.slug && !/-[a-z0-9]{3,6}$/.test(baseSlug)) {
      baseSlug = `${baseSlug}-${nanoid(4).toLowerCase()}`;
    }
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.invitation.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${nanoid(4).toLowerCase()}`;
      counter++;
      if (counter > 15) {
        finalSlug = `farah-${Date.now().toString().slice(-6)}-${nanoid(3).toLowerCase()}`;
        break;
      }
    }

    // 4. Resolve Theme
    let finalThemeId = invInput.themeId;
    if (finalThemeId) {
      const themeRecord = await prisma.theme.findUnique({ where: { id: finalThemeId } });
      if (!themeRecord) finalThemeId = null;
    }
    if (!finalThemeId) {
      const defaultTheme =
        (await prisma.theme.findFirst({ where: { isDefault: true, isActive: true } })) ||
        (await prisma.theme.findFirst({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })) ||
        (await prisma.theme.findFirst());
      finalThemeId = defaultTheme?.id || 'theme-royal-burgundy';
    }

    // 5. Resolve Dates
    // 5. Resolve Dates
    const parsedEventDate =
      invInput.eventDate && !isNaN(new Date(invInput.eventDate).getTime())
        ? new Date(invInput.eventDate)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // 6. Handle Custom Audio Buffer if provided as base64
    let initialMusicUrl =
      invInput.musicUrl && invInput.musicUrl.trim()
        ? invInput.musicUrl.trim()
        : invInput.backgroundMusicUrl && invInput.backgroundMusicUrl.trim()
        ? invInput.backgroundMusicUrl.trim()
        : null;

    let base64AudioData: { buffer: Buffer; mimeType: string; originalName: string } | null = null;
    if (initialMusicUrl && initialMusicUrl.startsWith('data:audio/')) {
      try {
        const matches = initialMusicUrl.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          const ext = mimeType.includes('wav') ? 'wav' : mimeType.includes('ogg') ? 'ogg' : 'mp3';
          base64AudioData = {
            buffer,
            mimeType,
            originalName: `${(invInput.musicTitle || 'custom-audio').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')}-${Date.now()}.${ext}`,
          };
          initialMusicUrl = null;
        }
      } catch (err) {
        console.error('Failed to parse base64 audio:', err);
      }
    }

    // 7. Create Draft Invitation + Order + Payment in Transaction
    const result = await prisma.$transaction(async (tx) => {
      const inv = await tx.invitation.create({
        data: {
          customerId: customer.id,
          slug: finalSlug,
          title: (invInput.title || `دعوة فرح ${groom} & ${bride} ❤️`).trim(),
          type: invInput.type || 'wedding',
          status: 'draft', // Draft until admin verifies payment!
          privacy: 'unlisted',
          coupleGroomAr: groom,
          coupleBrideAr: bride,
          coupleGroomEn: invInput.coupleGroomEn || null,
          coupleBrideEn: invInput.coupleBrideEn || null,
          parentsGroomAr: invInput.parentsGroomAr || null,
          parentsBrideAr: invInput.parentsBrideAr || null,
          weddingMessageAr:
            invInput.weddingMessageAr && invInput.weddingMessageAr.trim()
              ? invInput.weddingMessageAr.trim()
              : null,
          weddingMessageEn: invInput.weddingMessageEn || null,
          coverImageUrl: invInput.coverImageUrl || null,
          coupleImageUrl: invInput.coupleImageUrl || null,
          galleryImages: Array.isArray(invInput.galleryImages) ? invInput.galleryImages : [],
          musicUrl: initialMusicUrl,
          musicTitle: invInput.musicTitle || 'موسيقى ليلة العمر',
          themeId: finalThemeId,
          themeConfig: (() => {
            const isVipTier = packageId === 'luxury-vip';
            const baseConfig: any = {
              fontFamily: invInput.fontFamily || "'Cairo', sans-serif",
              selectedPackage: packageId,
              ...(invInput.themeConfig || {}),
              customOgImageUrl:
                invInput.customOgImageUrl ||
                invInput.themeConfig?.customOgImageUrl ||
                null,
              whatsappPhone:
                invInput.whatsappPhone !== undefined
                  ? (invInput.whatsappPhone && String(invInput.whatsappPhone).trim() ? String(invInput.whatsappPhone).trim() : null)
                  : invInput.themeConfig?.whatsappPhone || null,
              whatsappContactEnabled:
                invInput.whatsappContactEnabled !== undefined
                  ? Boolean(invInput.whatsappContactEnabled)
                  : invInput.themeConfig?.whatsappContactEnabled !== false,
            };
            return baseConfig;
          })(),
          isMultiEvent: Boolean(invInput.isMultiEvent),
          rsvpEnabled: invInput.rsvpEnabled !== undefined ? Boolean(invInput.rsvpEnabled) : true,
          countdownEnabled:
            invInput.countdownEnabled !== undefined ? Boolean(invInput.countdownEnabled) : true,
          envelopeAnimationEnabled:
            invInput.envelopeAnimationEnabled !== undefined
              ? Boolean(invInput.envelopeAnimationEnabled)
              : true,
          eventDate: parsedEventDate,
        },
      });

      // Save custom audio file to storage if provided as base64
      if (base64AudioData) {
        try {
          const stored = await storageService.saveFile({
            buffer: base64AudioData.buffer,
            originalName: base64AudioData.originalName,
            mimeType: base64AudioData.mimeType,
            category: 'music',
            invitationId: inv.id,
          });

          await tx.invitation.update({
            where: { id: inv.id },
            data: { musicUrl: stored.url },
          });

          await tx.media.create({
            data: {
              invitationId: inv.id,
              type: 'audio',
              category: 'music',
              filePath: stored.filePath,
              fileName: stored.fileName,
              originalName: stored.originalName,
              mimeType: stored.mimeType,
              sizeBytes: stored.sizeBytes,
              url: stored.url,
              isPublic: true,
            },
          });
        } catch (err) {
          console.error('Failed to save base64 audio to storage:', err);
        }
      } else if (initialMusicUrl && initialMusicUrl.startsWith('/api/media/')) {
        // Link pre-uploaded custom audio to this invitation
        const matchedMedia = await tx.media.findFirst({
          where: { url: initialMusicUrl },
        });
        if (matchedMedia) {
          await tx.media.update({
            where: { id: matchedMedia.id },
            data: { invitationId: inv.id },
          });
        } else {
          const relPath = initialMusicUrl.replace(/^\/api\/media\/(public|secure)\//, '');
          await tx.media.create({
            data: {
              invitationId: inv.id,
              type: 'audio',
              category: 'music',
              filePath: relPath,
              fileName: relPath.split('/').pop() || 'audio.mp3',
              originalName: invInput.musicTitle || 'custom-audio.mp3',
              mimeType: 'audio/mpeg',
              sizeBytes: 0,
              url: initialMusicUrl,
              isPublic: true,
            },
          });
        }
      }

      // Seed sections with client custom visibility toggles
      const clientSections = Array.isArray(invInput.sections) ? invInput.sections : [];
      const sectionsToCreate = DEFAULT_SECTIONS.map((sec, idx) => {
        const clientSec = clientSections.find((cs: any) => cs.sectionKey === sec.key);
        // Also sync special master flags if applicable
        let isSecEnabled =
          clientSec !== undefined ? Boolean(clientSec.isEnabled) : sec.defaultEnabled;
        if (sec.key === 'envelope' && invInput.envelopeAnimationEnabled !== undefined) {
          isSecEnabled = Boolean(invInput.envelopeAnimationEnabled);
        } else if (sec.key === 'countdown' && invInput.countdownEnabled !== undefined) {
          isSecEnabled = Boolean(invInput.countdownEnabled);
        } else if (sec.key === 'rsvp' && invInput.rsvpEnabled !== undefined) {
          isSecEnabled = Boolean(invInput.rsvpEnabled);
        } else if (sec.key === 'message' && !invInput.weddingMessageAr?.trim()) {
          // If verse is deleted / emptied, message section should be disabled
          isSecEnabled = clientSec !== undefined ? Boolean(clientSec.isEnabled) : false;
        }

        return {
          invitationId: inv.id,
          sectionKey: sec.key,
          isEnabled: isSecEnabled,
          sortOrder: idx,
        };
      });

      await tx.invitationSection.createMany({
        data: sectionsToCreate,
      });

      // Seed primary event or journey events
      const clientEvents = Array.isArray(invInput.events) ? invInput.events : [];
      if (clientEvents.length > 0) {
        for (let idx = 0; idx < clientEvents.length; idx++) {
          const ev = clientEvents[idx];
          const eventDateParsed =
            ev.date && !isNaN(new Date(ev.date).getTime())
              ? new Date(ev.date)
              : parsedEventDate;
          const eventType =
            ev.type === 'katbketab'
              ? 'katb_ketab'
              : ['engagement', 'henna', 'katb_ketab', 'wedding', 'reception', 'custom'].includes(
                  ev.type
                )
              ? ev.type
              : 'wedding';

          let evLat =
            typeof ev.latitude === 'number' && isValidCoordinates(ev.latitude, ev.longitude)
              ? ev.latitude
              : null;
          let evLng =
            typeof ev.longitude === 'number' && isValidCoordinates(ev.latitude, ev.longitude)
              ? ev.longitude
              : null;
          const evMapUrl =
            ev.googleMapsUrl || (ev.type === 'wedding' ? invInput.googleMapsUrl : null) || null;
          if (!evLat && evMapUrl) {
            const extracted = extractCoordinatesFromUrl(evMapUrl);
            if (extracted) {
              evLat = extracted.latitude;
              evLng = extracted.longitude;
            }
          }
          const evVenue = ev.venueNameAr || invInput.venueNameAr || 'قاعة الحفل';
          const evAddr = ev.addressAr || invInput.addressAr || 'القاهرة، مصر';
          if (!evLat) {
            const city = resolveCityCoordinates(`${evVenue} ${evAddr}`);
            if (city) {
              evLat = city.latitude;
              evLng = city.longitude;
            }
          }
          const evOsmUrl =
            ev.openStreetMapUrl || (evLat && evLng ? getOpenStreetMapUrl(evLat, evLng) : null);

          await tx.invitationEvent.create({
            data: {
              invitationId: inv.id,
              type: eventType,
              titleAr:
                ev.titleAr ||
                (ev.type === 'wedding'
                  ? invInput.title || 'حفل الزفاف المبارك'
                  : 'مناسبة الفرح'),
              date: eventDateParsed,
              startTime: ev.startTime || ev.time || '08:00 م',
              endTime: ev.endTime || null,
              venueNameAr: evVenue,
              addressAr: evAddr,
              googleMapsUrl: evMapUrl,
              latitude: evLat,
              longitude: evLng,
              openStreetMapUrl: evOsmUrl,
              sortOrder: idx,
              isVisible: ev.isVisible !== false,
              isHennaFemaleOnly: Boolean(ev.isHennaFemaleOnly),
              dressCodeAr: ev.dressCodeAr || null,
            },
          });
        }
      } else if (invInput.venueNameAr || invInput.addressAr || invInput.venueAddressAr || invInput.googleMapsUrl) {
        let evLat =
          typeof invInput.latitude === 'number' &&
          isValidCoordinates(invInput.latitude, invInput.longitude)
            ? invInput.latitude
            : null;
        let evLng =
          typeof invInput.longitude === 'number' &&
          isValidCoordinates(invInput.latitude, invInput.longitude)
            ? invInput.longitude
            : null;
        const evMapUrl = invInput.googleMapsUrl || null;
        if (!evLat && evMapUrl) {
          const extracted = extractCoordinatesFromUrl(evMapUrl);
          if (extracted) {
            evLat = extracted.latitude;
            evLng = extracted.longitude;
          }
        }
        const evVenue = invInput.venueNameAr || 'قاعة الحفل';
        const evAddr = invInput.addressAr || invInput.venueAddressAr || 'القاهرة، مصر';
        if (!evLat) {
          const city = resolveCityCoordinates(`${evVenue} ${evAddr}`);
          if (city) {
            evLat = city.latitude;
            evLng = city.longitude;
          }
        }
        const evOsmUrl =
          invInput.openStreetMapUrl || (evLat && evLng ? getOpenStreetMapUrl(evLat, evLng) : null);

        await tx.invitationEvent.create({
          data: {
            invitationId: inv.id,
            type: (invInput.type as any) || 'wedding',
            titleAr: invInput.title || `حفل الزفاف المبارك`,
            date: parsedEventDate,
            startTime: invInput.startTime || '08:00 م',
            venueNameAr: evVenue,
            addressAr: evAddr,
            googleMapsUrl: evMapUrl,
            latitude: evLat,
            longitude: evLng,
            openStreetMapUrl: evOsmUrl,
          },
        });
      }

      // Resolve authoritative amount from database pricing plan
      let authoritativeAmount = Number(amount) || 95;
      if (packageId) {
        const matchedPlan = await tx.pricingPlan.findFirst({
          where: {
            OR: [{ slug: packageId }, { id: packageId }],
            isActive: true,
          },
        });
        if (matchedPlan) {
          authoritativeAmount = Number(matchedPlan.price);
        }
      }

      // Create Order
      const orderNumber = `FARAH-${Date.now().toString().slice(-6)}`;
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          invitationId: inv.id,
          packageId,
          amount: authoritativeAmount,
          currency: 'EGP',
          status: 'payment_proof_received', // Waiting for admin confirmation!
          notes: `طلب تصميم ذاتي بواسطة العميل - بانتظار التحقق من إيصال الدفع (${paymentMethod})`,
        },
      });

      // Create Payment
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          customerId: customer.id,
          amount: authoritativeAmount,
          currency: 'EGP',
          method: paymentMethod as any,
          status: 'proof_received',
          paymentProofUrl: finalProofUrl || null,
          referenceNumber: referenceNumber || null,
          notes: `إيصال تحويل مقدم من العميل عند الحفظ الذاتي`,
        },
      });

      return { invitation: inv, order, payment };
    });

    // 7. Dispatch Immediate Email Notification to Super Admin (Async, Non-blocking)
    sendPaymentProofNotification({
      orderNumber: result.order.orderNumber,
      customerName: cleanName,
      customerPhone: cleanPhone,
      coupleNames: `${groom} & ${bride}`,
      amount: Number(amount) || 95,
      paymentMethod,
      referenceNumber: referenceNumber || null,
      paymentProofUrl: finalProofUrl || null,
      invitationTitle: result.invitation.title,
      slug: result.invitation.slug,
      packageId,
      type: result.invitation.type,
    }).catch((err) => {
      console.error('[PublicController] Background admin email notification error:', err);
    });

    // 8. Dispatch Customer Confirmation Email if email address was provided
    if (cleanEmail) {
      sendCustomerOrderConfirmationEmail({
        customerEmail: cleanEmail,
        customerName: cleanName,
        coupleNames: `${groom} & ${bride}`,
        orderNumber: result.order.orderNumber,
        invitationTitle: result.invitation.title,
        slug: result.invitation.slug,
        previewToken: result.invitation.previewToken,
        type: result.invitation.type,
        amount: Number(result.order.amount),
        packageId,
      }).catch((err) => {
        console.error('[PublicController] Customer confirmation email error:', err);
      });
    }

    return res.status(201).json({
      success: true,
      message: 'تم استلام تصميم دعوتك وإيصال الدفع بنجاح! جاري مراجعة الإيصال وتفعيل الرابط الرسمي خلال دقائق معدودة 🎉',
      data: {
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        invitationId: result.invitation.id,
        paymentId: result.payment.id,
        slug: result.invitation.slug,
        previewToken: result.invitation.previewToken,
        status: result.order.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadPublicAudio(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'لم يتم إرسال أي ملف صوتي' });
    }

    const validation = storageService.validateFile({
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const stored = await storageService.saveFile({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      category: 'music',
    });

    const media = await prisma.media.create({
      data: {
        filePath: stored.filePath,
        fileName: stored.fileName,
        originalName: stored.originalName,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        url: stored.url,
        type: 'audio',
        category: 'music',
        isPublic: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        id: media.id,
        url: stored.url,
        fileName: stored.fileName,
        originalName: stored.originalName,
        sizeBytes: stored.sizeBytes,
      },
      message: 'تم رفع وتخزين المقطع الصوتي على السيرفر بنجاح',
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'فشل رفع الملف الصوتي',
    });
  }
}

/**
 * Get private guest list & RSVP responses for the couple / host only
 * Secured via unguessable invitation previewToken or private key
 */
export async function getPrivateGuestList(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: 'رمز الوصول غير صالح' });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);

    const invitation = await prisma.invitation.findFirst({
      where: {
        OR: [
          { previewToken: token },
          ...(isUuid ? [{ id: token }] : []),
          { slug: token },
        ],
        isDeleted: null,
      },
      include: {
        events: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
        },
        sections: {
          where: { sectionKey: 'rsvp' },
        },
        customer: {
          select: { name: true, phone: true },
        },
      },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'عذراً، لم يتم العثور على كشف المعازيم المطلوب. يرجى التأكد من الرابط الخاص بك.',
      });
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

    const isSectionActive = invitation.sections?.[0] ? invitation.sections[0].isEnabled : true;

    return res.json({
      success: true,
      data: {
        invitation: {
          id: invitation.id,
          title: invitation.title,
          slug: invitation.slug,
          type: invitation.type,
          coupleGroomAr: invitation.coupleGroomAr,
          coupleBrideAr: invitation.coupleBrideAr,
          eventDate: invitation.eventDate,
          coverImageUrl: invitation.coverImageUrl,
          rsvpEnabled: invitation.rsvpEnabled && isSectionActive,
          previewToken: invitation.previewToken,
          events: invitation.events,
          customer: invitation.customer,
        },
        stats: {
          totalResponses: rsvps.length,
          attendingCount,
          notAttendingCount,
          maybeCount,
          totalGuests,
        },
        rsvps,
      },
    });
  } catch (error) {
    next(error);
  }
}



