import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { nanoid } from 'nanoid';
import {
  DEFAULT_SECTIONS,
  isValidSafeUrl,
  normalizeWebUrl,
  generateInvitationSlug,
  isDefaultMusicPreset,
  extractCoordinatesFromUrl,
  resolveCityCoordinates,
  getOpenStreetMapUrl,
  isValidCoordinates,
} from '@farahna/shared';
import { storageService } from '../services/storage';

export async function getInvitations(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, type, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isDeleted: null };
    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { slug: { contains: search as string, mode: 'insensitive' } },
        { coupleGroomAr: { contains: search as string } },
        { coupleBrideAr: { contains: search as string } },
      ];
    }

    const [total, invitations] = await Promise.all([
      prisma.invitation.count({ where }),
      prisma.invitation.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true, phone: true, whatsapp: true },
          },
          theme: {
            select: { id: true, name: true, nameAr: true, slug: true },
          },
          _count: {
            select: { events: true, rsvps: true },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        invitations,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvitationById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        customer: true,
        theme: true,
        order: {
          include: { payments: true },
        },
        events: {
          orderBy: { sortOrder: 'asc' },
        },
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
        rsvps: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!invitation || invitation.isDeleted) {
      return res.status(404).json({ success: false, message: 'الدعوة غير موجودة' });
    }

    return res.json({ success: true, data: invitation });
  } catch (error) {
    next(error);
  }
}

const RESERVED_SLUGS = [
  'admin',
  'api',
  'auth',
  'login',
  'preview',
  'invitation',
  'invitations',
  'dashboard',
  'settings',
  'new',
  'edit',
  'static',
  'storage',
  'health',
  'public',
  'media',
  'orders',
  'leads',
  'customers',
  'payments',
  'rsvp',
  'themes',
  'pricing',
  'events',
];

export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'الرابط المختصر مطلوب' };
  }
  const clean = slug.toLowerCase().trim();
  if (clean.length < 3) {
    return { valid: false, error: 'الرابط المختصر يجب أن يكون 3 أحرف على الأقل' };
  }
  if (clean.length > 60) {
    return { valid: false, error: 'الرابط المختصر يجب ألا يتجاوز 60 حرفاً' };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(clean)) {
    return { valid: false, error: 'الرابط يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشُرط فقط وبدون تكرار للشُرط' };
  }
  if (RESERVED_SLUGS.includes(clean)) {
    return { valid: false, error: 'هذا الرابط المختصر محجوز لصفحات النظام، يرجى اختيار رابط آخر' };
  }
  return { valid: true };
}

// Note: isValidSafeUrl is imported from @farahna/shared

export async function createInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      eventDate,
      startDate,
      expiresAt,
      slug,
      title,
      themeId,
      customerId,
      customer,
      newCustomerName,
      newCustomerPhone,
      coupleGroomAr,
      coupleBrideAr,
      type = 'wedding',
      status = 'draft',
      privacy = 'unlisted',
      coupleGroomEn,
      coupleBrideEn,
      parentsGroomAr,
      parentsBrideAr,
      weddingMessageAr,
      weddingMessageEn,
      coverImageUrl,
      coupleImageUrl,
      galleryImages,
      musicUrl,
      musicTitle,
      themeConfig,
      isMultiEvent,
      rsvpEnabled,
      countdownEnabled,
      envelopeAnimationEnabled,
      orderId,
    } = req.body;

    // Handle base64 audio if submitted
    let initialMusicUrl = musicUrl;
    let base64AudioData: { buffer: Buffer; mimeType: string; originalName: string } | null = null;
    if (initialMusicUrl && typeof initialMusicUrl === 'string' && initialMusicUrl.startsWith('data:audio/')) {
      try {
        const matches = initialMusicUrl.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          const ext = mimeType.includes('wav') ? 'wav' : mimeType.includes('ogg') ? 'ogg' : 'mp3';
          base64AudioData = {
            buffer,
            mimeType,
            originalName: `${(musicTitle || 'custom-audio').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')}-${Date.now()}.${ext}`,
          };
          initialMusicUrl = null;
        }
      } catch (err) {
        console.error('Failed to parse base64 audio in createInvitation:', err);
      }
    }

    // Validate URLs
    if (
      (initialMusicUrl && !isValidSafeUrl(initialMusicUrl)) ||
      !isValidSafeUrl(coverImageUrl) ||
      !isValidSafeUrl(coupleImageUrl)
    ) {
      return res.status(400).json({
        success: false,
        message: 'أحد روابط الوسائط أو الموسيقى غير صالح، يرجى التأكد من الرابط (يجب أن يبدأ بـ http:// أو https:// أو مسار تخزين محلي)',
      });
    }

    // Resolve or Auto-Generate Slug
    let finalSlug = (slug || '').toLowerCase().trim().replace(/^-+|-+$/g, '');
    if (finalSlug) {
      // Append random characters if not already present
      if (!/-[a-z0-9]{3,6}$/.test(finalSlug)) {
        finalSlug = `${finalSlug}-${nanoid(4).toLowerCase()}`;
      }
      const slugCheck = validateSlug(finalSlug);
      if (!slugCheck.valid) {
        return res.status(400).json({ success: false, message: slugCheck.error });
      }

      // Check slug uniqueness; if duplicate, append another random suffix
      let counter = 1;
      while (await prisma.invitation.findUnique({ where: { slug: finalSlug } })) {
        finalSlug = `${finalSlug.replace(/-[a-z0-9]+$/, '')}-${nanoid(4).toLowerCase()}`;
        counter++;
        if (counter > 10) {
          finalSlug = `farah-${Date.now().toString().slice(-6)}-${nanoid(3).toLowerCase()}`;
          break;
        }
      }
    } else {
      // Auto-generate clean unique slug
      let baseSlug = generateInvitationSlug(coupleGroomAr, coupleBrideAr);
      let candidateSlug = baseSlug;
      let counter = 1;
      while (await prisma.invitation.findUnique({ where: { slug: candidateSlug } })) {
        candidateSlug = `${baseSlug}-${nanoid(4).toLowerCase()}`;
        counter++;
        if (counter > 10) {
          candidateSlug = `farah-${Date.now().toString().slice(-6)}-${nanoid(3).toLowerCase()}`;
          break;
        }
      }
      finalSlug = candidateSlug;
    }

    // Resolve Title
    const finalTitle =
      (title || '').trim() ||
      `دعوة فرح - ${coupleGroomAr || 'العروسين'}${coupleBrideAr ? ' & ' + coupleBrideAr : ''} ❤️`;

    // Resolve Customer (Support all cases: explicit UUID, inline new customer, or auto guest)
    let finalCustomerId = customerId;

    if (finalCustomerId && finalCustomerId !== 'quick_draft' && finalCustomerId !== 'none') {
      const existingCustomer = await prisma.customer.findUnique({
        where: { id: finalCustomerId },
      });
      if (!existingCustomer) {
        finalCustomerId = null; // Will fallback below
      }
    } else {
      finalCustomerId = null;
    }

    // Check if inline customer details were provided
    if (!finalCustomerId) {
      const phoneInput = (customer?.phone || newCustomerPhone || '').trim();
      const nameInput = (customer?.name || newCustomerName || '').trim();

      if (phoneInput) {
        let matchedCustomer = await prisma.customer.findFirst({
          where: { phone: phoneInput },
        });
        if (!matchedCustomer) {
          matchedCustomer = await prisma.customer.create({
            data: {
              name: nameInput || coupleGroomAr || 'عميل دعوة جديدة',
              phone: phoneInput,
              whatsapp: customer?.whatsapp || newCustomerPhone || phoneInput,
              notes: `تم إنشاؤه تلقائياً أثناء إنشاء دعوة ${finalTitle}`,
              source: 'website',
              status: 'active',
            },
          });
        }
        finalCustomerId = matchedCustomer.id;
      }
    }

    // Fallback to fast default customer if still not resolved (quick draft mode)
    if (!finalCustomerId) {
      let defaultCustomer = await prisma.customer.findFirst({
        where: { phone: '01000000000' },
      });
      if (!defaultCustomer) {
        defaultCustomer = await prisma.customer.create({
          data: {
            name: coupleGroomAr ? `عميل (${coupleGroomAr})` : 'عميل سريع / دعوة عامة',
            phone: '01000000000',
            notes: 'تم إنشاء هذا الحساب تلقائياً لسرعة إنشاء الدعوات المباشرة',
            source: 'website',
            status: 'active',
          },
        });
      }
      finalCustomerId = defaultCustomer.id;
    }

    // Resolve Theme
    let finalThemeId = themeId;
    if (finalThemeId) {
      const themeRecord = await prisma.theme.findUnique({
        where: { id: finalThemeId },
      });
      if (!themeRecord) {
        finalThemeId = null;
      }
    }

    if (!finalThemeId) {
      const defaultTheme =
        (await prisma.theme.findFirst({ where: { isDefault: true, isActive: true } })) ||
        (await prisma.theme.findFirst({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })) ||
        (await prisma.theme.findFirst());
      finalThemeId = defaultTheme?.id || 'theme-royal-burgundy';
    }

    // Resolve Dates
    const parsedEventDate =
      eventDate && !isNaN(new Date(eventDate).getTime())
        ? new Date(eventDate)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const parsedStartDate =
      startDate && !isNaN(new Date(startDate).getTime()) ? new Date(startDate) : null;

    const parsedExpiresAt =
      expiresAt && !isNaN(new Date(expiresAt).getTime()) ? new Date(expiresAt) : null;

    // Resolve Order ID if valid
    let finalOrderId: string | null = null;
    if (orderId && typeof orderId === 'string' && orderId.trim()) {
      const orderExists = await prisma.order.findUnique({ where: { id: orderId } });
      if (orderExists) {
        finalOrderId = orderExists.id;
      }
    }

    const invitation = await prisma.$transaction(async (tx) => {
      const inv = await tx.invitation.create({
        data: {
          customerId: finalCustomerId,
          orderId: finalOrderId,
          slug: finalSlug,
          title: finalTitle,
          type,
          status,
          privacy,
          coupleGroomAr: coupleGroomAr || 'العريس',
          coupleBrideAr: coupleBrideAr || 'العروس',
          coupleGroomEn: coupleGroomEn || null,
          coupleBrideEn: coupleBrideEn || null,
          parentsGroomAr: parentsGroomAr || null,
          parentsBrideAr: parentsBrideAr || null,
          weddingMessageAr: weddingMessageAr || null,
          weddingMessageEn: weddingMessageEn || null,
          coverImageUrl: coverImageUrl || null,
          coupleImageUrl: coupleImageUrl || null,
          galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
          musicUrl: initialMusicUrl || null,
          musicTitle: musicTitle || null,
          themeId: finalThemeId,
          themeConfig: themeConfig || {},
          isMultiEvent: Boolean(isMultiEvent),
          rsvpEnabled: rsvpEnabled !== undefined ? Boolean(rsvpEnabled) : true,
          countdownEnabled: countdownEnabled !== undefined ? Boolean(countdownEnabled) : true,
          envelopeAnimationEnabled: envelopeAnimationEnabled !== undefined ? Boolean(envelopeAnimationEnabled) : true,
          eventDate: parsedEventDate,
          startDate: parsedStartDate,
          expiresAt: parsedExpiresAt,
        },
      });

      // Save custom audio to storage if submitted as base64
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
          (inv as any).musicUrl = stored.url;
        } catch (err) {
          console.error('Failed to save base64 audio in createInvitation:', err);
        }
      } else if (initialMusicUrl && initialMusicUrl.startsWith('/api/media/')) {
        const matchedMedia = await tx.media.findFirst({
          where: { url: initialMusicUrl },
        });
        if (matchedMedia) {
          await tx.media.update({
            where: { id: matchedMedia.id },
            data: { invitationId: inv.id },
          });
        }
      }

      // Seed default sections
      await tx.invitationSection.createMany({
        data: DEFAULT_SECTIONS.map((sec, idx) => ({
          invitationId: inv.id,
          sectionKey: sec.key,
          isEnabled: sec.defaultEnabled,
          sortOrder: idx,
        })),
      });

      return inv;
    });

    return res.status(201).json({
      success: true,
      data: invitation,
      message: 'تم إنشاء الدعوة بنجاح وتجهيز أقسامها الافتراضية',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const {
      eventDate,
      startDate,
      expiresAt,
      slug,
      sections,
      events,
      customer,
      theme,
      order,
      rsvps,
      reminders,
      analytics,
      whatsappPhone,
      whatsappContactEnabled,
      ...rest
    } = req.body;

    // Merge whatsapp contact settings into themeConfig if provided at root level
    if (whatsappPhone !== undefined || whatsappContactEnabled !== undefined) {
      rest.themeConfig = {
        ...(typeof rest.themeConfig === 'object' && rest.themeConfig ? rest.themeConfig : {}),
        ...(whatsappPhone !== undefined
          ? { whatsappPhone: whatsappPhone ? String(whatsappPhone).trim() : null }
          : {}),
        ...(whatsappContactEnabled !== undefined
          ? { whatsappContactEnabled: Boolean(whatsappContactEnabled) }
          : {}),
      };
    }

    if (slug) {
      const cleanSlug = slug.toLowerCase().trim();
      const slugCheck = validateSlug(cleanSlug);
      if (!slugCheck.valid) {
        return res.status(400).json({ success: false, message: slugCheck.error });
      }

      const existing = await prisma.invitation.findFirst({
        where: { slug: cleanSlug, NOT: { id } },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'الرابط المختصر مستخدم بالفعل من قبل دعوة أخرى',
        });
      }
    }

    // Handle base64 audio in updateInvitation if provided
    if (rest.musicUrl && typeof rest.musicUrl === 'string' && rest.musicUrl.startsWith('data:audio/')) {
      try {
        const matches = rest.musicUrl.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          const ext = mimeType.includes('wav') ? 'wav' : mimeType.includes('ogg') ? 'ogg' : 'mp3';
          const stored = await storageService.saveFile({
            buffer,
            originalName: `${(rest.musicTitle || 'custom-audio').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')}-${Date.now()}.${ext}`,
            mimeType,
            category: 'music',
            invitationId: id,
          });
          rest.musicUrl = stored.url;

          await prisma.media.create({
            data: {
              invitationId: id,
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
        }
      } catch (err) {
        console.error('Failed to convert base64 audio in updateInvitation:', err);
      }
    }

    // Cleanup previous custom audio if user changed or cleared it
    const currentInv = await prisma.invitation.findUnique({
      where: { id },
      select: { musicUrl: true },
    });

    if (
      rest.musicUrl !== undefined &&
      currentInv?.musicUrl &&
      !isDefaultMusicPreset(currentInv.musicUrl) &&
      currentInv.musicUrl !== rest.musicUrl
    ) {
      await deleteInvitationCustomAudio(id, currentInv.musicUrl);
    }

    if (
      (rest.musicUrl !== undefined && !isValidSafeUrl(rest.musicUrl)) ||
      (rest.coverImageUrl !== undefined && !isValidSafeUrl(rest.coverImageUrl)) ||
      (rest.coupleImageUrl !== undefined && !isValidSafeUrl(rest.coupleImageUrl))
    ) {
      return res.status(400).json({
        success: false,
        message: 'أحد روابط الوسائط أو الموسيقى غير صالح، يرجى التأكد من الرابط (يجب أن يبدأ بـ http:// أو https:// أو مسار تخزين محلي)',
      });
    }

    // Allow deleting / emptying weddingMessageAr cleanly
    if (rest.weddingMessageAr !== undefined) {
      rest.weddingMessageAr =
        rest.weddingMessageAr && rest.weddingMessageAr.trim()
          ? rest.weddingMessageAr.trim()
          : null;
    }

    const invitation = await prisma.invitation.update({
      where: { id },
      data: {
        ...rest,
        ...(slug && { slug }),
        ...(eventDate && { eventDate: new Date(eventDate) }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      },
    });

    // Update individual sections if provided
    if (Array.isArray(sections)) {
      for (const sec of sections) {
        if (sec.sectionKey) {
          await prisma.invitationSection.upsert({
            where: {
              invitationId_sectionKey: {
                invitationId: id,
                sectionKey: sec.sectionKey,
              },
            },
            update: {
              isEnabled: Boolean(sec.isEnabled),
              ...(sec.sortOrder !== undefined ? { sortOrder: sec.sortOrder } : {}),
            },
            create: {
              invitationId: id,
              sectionKey: sec.sectionKey,
              isEnabled: Boolean(sec.isEnabled),
              sortOrder: sec.sortOrder || 0,
            },
          });
        }
      }
    }

    // Update individual events if provided
    if (Array.isArray(events)) {
      const validEventIds = events
        .map((e: any) => e.id)
        .filter(
          (eventId: any) =>
            typeof eventId === 'string' &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)
        );

      // Remove events that are no longer present
      await prisma.invitationEvent.deleteMany({
        where: {
          invitationId: id,
          ...(validEventIds.length > 0 ? { id: { notIn: validEventIds } } : {}),
        },
      });

      // Upsert / create each event
      for (let idx = 0; idx < events.length; idx++) {
        const ev = events[idx];
        const isUuid =
          typeof ev.id === 'string' &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ev.id);
        const eventDateParsed =
          ev.date && !isNaN(new Date(ev.date).getTime())
            ? new Date(ev.date)
            : eventDate
            ? new Date(eventDate)
            : new Date();

        const eventType =
          ev.type === 'katbketab'
            ? 'katb_ketab'
            : ['engagement', 'henna', 'katb_ketab', 'wedding', 'reception', 'custom'].includes(
                ev.type
              )
            ? ev.type
            : 'wedding';

        let eventLat =
          typeof ev.latitude === 'number' && isValidCoordinates(ev.latitude, ev.longitude)
            ? ev.latitude
            : null;
        let eventLng =
          typeof ev.longitude === 'number' && isValidCoordinates(ev.latitude, ev.longitude)
            ? ev.longitude
            : null;
        if (!eventLat && ev.googleMapsUrl) {
          const extracted = extractCoordinatesFromUrl(ev.googleMapsUrl);
          if (extracted) {
            eventLat = extracted.latitude;
            eventLng = extracted.longitude;
          }
        }
        if (!eventLat && (ev.venueNameAr || ev.addressAr)) {
          const city = resolveCityCoordinates(`${ev.venueNameAr || ''} ${ev.addressAr || ''}`);
          if (city) {
            eventLat = city.latitude;
            eventLng = city.longitude;
          }
        }
        const eventOsmUrl =
          ev.openStreetMapUrl || (eventLat && eventLng ? getOpenStreetMapUrl(eventLat, eventLng) : null);

        const eventData = {
          type: eventType,
          titleAr: ev.titleAr || 'حفل الزفاف',
          titleEn: ev.titleEn || null,
          subtitleAr: ev.subtitleAr || null,
          date: eventDateParsed,
          startTime: ev.startTime || ev.time || '08:00 م',
          endTime: ev.endTime || null,
          venueNameAr: ev.venueNameAr || 'قاعة الحفل',
          venueNameEn: ev.venueNameEn || null,
          addressAr: ev.addressAr || 'القاهرة، مصر',
          googleMapsUrl: ev.googleMapsUrl || null,
          latitude: eventLat,
          longitude: eventLng,
          openStreetMapUrl: eventOsmUrl,
          dressCodeAr: ev.dressCodeAr || null,
          sortOrder: ev.sortOrder !== undefined ? Number(ev.sortOrder) : idx,
          isVisible: ev.isVisible !== false,
          isHennaFemaleOnly: Boolean(ev.isHennaFemaleOnly),
        };

        if (isUuid) {
          await prisma.invitationEvent.upsert({
            where: { id: ev.id },
            update: eventData,
            create: {
              ...eventData,
              id: ev.id,
              invitationId: id,
            },
          });
        } else {
          await prisma.invitationEvent.create({
            data: {
              ...eventData,
              invitationId: id,
            },
          });
        }
      }
    }

    // Keep legacy toggle flags in sync with sections
    if (rest.rsvpEnabled !== undefined) {
      await prisma.invitationSection.updateMany({
        where: { invitationId: id, sectionKey: 'rsvp' },
        data: { isEnabled: Boolean(rest.rsvpEnabled) },
      }).catch(() => {});
    }

    if (rest.countdownEnabled !== undefined) {
      await prisma.invitationSection.updateMany({
        where: { invitationId: id, sectionKey: 'countdown' },
        data: { isEnabled: Boolean(rest.countdownEnabled) },
      }).catch(() => {});
    }

    if (rest.envelopeAnimationEnabled !== undefined) {
      await prisma.invitationSection.updateMany({
        where: { invitationId: id, sectionKey: 'envelope' },
        data: { isEnabled: Boolean(rest.envelopeAnimationEnabled) },
      }).catch(() => {});
    }

    const fullUpdated = await prisma.invitation.findUnique({
      where: { id },
      include: {
        theme: true,
        events: { orderBy: { sortOrder: 'asc' } },
        sections: { orderBy: { sortOrder: 'asc' } },
        customer: true,
      },
    });

    return res.json({
      success: true,
      data: fullUpdated || invitation,
      message: 'تم تحديث بيانات الدعوة بنجاح',
    });
  } catch (error) {
    next(error);
  }
}

export async function publishInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const invitation = await prisma.invitation.update({
      where: { id },
      data: { status: 'published' },
    });

    return res.json({
      success: true,
      data: invitation,
      message: 'تم نشر الدعوة بنجاح وأصبحت متاحة للضيوف الآن',
    });
  } catch (error) {
    next(error);
  }
}

export async function pauseInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const invitation = await prisma.invitation.update({
      where: { id },
      data: { status: 'paused' },
    });

    return res.json({
      success: true,
      data: invitation,
      message: 'تم إيقاف الدعوة مؤقتاً بنجاح',
    });
  } catch (error) {
    next(error);
  }
}

export async function duplicateInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const original = await prisma.invitation.findUnique({
      where: { id },
      include: { events: true, sections: true },
    });

    if (!original) {
      return res.status(404).json({ success: false, message: 'الدعوة غير موجودة' });
    }

    const newSlug = `${original.slug}-copy-${nanoid(4).toLowerCase()}`;
    const duplicated = await prisma.$transaction(async (tx) => {
      const { id: _, createdAt, updatedAt, events, sections, themeConfig, ...cloneData } = original;
      const newInv = await tx.invitation.create({
        data: {
          ...cloneData,
          slug: newSlug,
          title: `${original.title} (نسخة)`,
          status: 'draft',
          viewsCount: 0,
          uniqueVisitorsCount: 0,
          themeConfig: (themeConfig as any) ?? undefined,
        },
      });

      if (events && events.length > 0) {
        await tx.invitationEvent.createMany({
          data: events.map((e) => {
            const { id: _, createdAt: _c, updatedAt: _u, themeOverride, ...eventData } = e;
            return {
              ...eventData,
              invitationId: newInv.id,
              themeOverride: (themeOverride as any) ?? undefined,
            };
          }),
        });
      }

      if (sections && sections.length > 0) {
        await tx.invitationSection.createMany({
          data: sections.map((s) => {
            const { id: _, createdAt: _c, updatedAt: _u, customConfig, ...secData } = s;
            return {
              ...secData,
              invitationId: newInv.id,
              customConfig: (customConfig as any) ?? undefined,
            };
          }),
        });
      }

      return newInv;
    });

    return res.status(201).json({
      success: true,
      data: duplicated,
      message: 'تم نسخ الدعوة بنجاح كمسودة جديدة',
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteInvitationCustomAudio(invitationId: string, musicUrl?: string | null): Promise<void> {
  try {
    let targetMusicUrl = musicUrl;
    if (targetMusicUrl === undefined) {
      const inv = await prisma.invitation.findUnique({
        where: { id: invitationId },
        select: { musicUrl: true },
      });
      targetMusicUrl = inv?.musicUrl;
    }

    const isDefault = isDefaultMusicPreset(targetMusicUrl);

    // 1. Find and delete custom audio media records linked to this invitation
    const audioMediaRecords = await prisma.media.findMany({
      where: {
        invitationId,
        OR: [{ type: 'audio' }, { category: 'music' }],
      },
    });

    for (const record of audioMediaRecords) {
      if (record.filePath && !isDefaultMusicPreset(record.url)) {
        await storageService.deleteFile(record.filePath);
      }
    }

    if (audioMediaRecords.length > 0) {
      await prisma.media.deleteMany({
        where: {
          id: { in: audioMediaRecords.map((m) => m.id) },
        },
      });
    }

    // 2. If targetMusicUrl is a custom server path (/api/media/...)
    if (targetMusicUrl && !isDefault && targetMusicUrl.startsWith('/api/media/')) {
      const relPath = targetMusicUrl.replace(/^\/api\/media\/(public|secure)\//, '');
      await storageService.deleteFile(relPath);
    }

    // 3. Remove physical directory storage/invitations/{invitationId}/music if present
    if (storageService.deleteDirectory) {
      const invMusicDir = path.join('invitations', invitationId, 'music');
      await storageService.deleteDirectory(invMusicDir);
    }
  } catch (error) {
    console.error(`[deleteInvitationCustomAudio] Error cleaning up audio for invitation ${invitationId}:`, error);
  }
}

export async function softDeleteInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      select: { id: true, musicUrl: true },
    });

    if (invitation) {
      // Clean up custom audio files from storage and database
      await deleteInvitationCustomAudio(id, invitation.musicUrl);
    }

    await prisma.invitation.update({
      where: { id },
      data: { isDeleted: new Date(), status: 'archived', musicUrl: null },
    });
    return res.json({ success: true, message: 'تم أرشفة الدعوة وحذف الأصوات المخصصة بنجاح من الخادم' });
  } catch (error) {
    next(error);
  }
}

