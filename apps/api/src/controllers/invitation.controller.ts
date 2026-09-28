import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { nanoid } from 'nanoid';
import { DEFAULT_SECTIONS } from '@farahna/shared';

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

export async function createInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventDate, startDate, expiresAt, ...rest } = req.body;

    // Check slug uniqueness
    const existingSlug = await prisma.invitation.findUnique({
      where: { slug: rest.slug },
    });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'الرابط المختصر مستخدم بالفعل، يرجى اختيار رابط آخر',
      });
    }

    const invitation = await prisma.$transaction(async (tx) => {
      const inv = await tx.invitation.create({
        data: {
          ...rest,
          eventDate: new Date(eventDate),
          startDate: startDate ? new Date(startDate) : null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });

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
    const { eventDate, startDate, expiresAt, slug, ...rest } = req.body;

    if (slug) {
      const existing = await prisma.invitation.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'الرابط المختصر مستخدم بالفعل من قبل دعوة أخرى',
        });
      }
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

    if (rest.rsvpEnabled !== undefined) {
      await prisma.invitationSection.updateMany({
        where: { invitationId: id, sectionKey: 'rsvp' },
        data: { isEnabled: rest.rsvpEnabled },
      });
    }

    return res.json({
      success: true,
      data: invitation,
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

export async function softDeleteInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.invitation.update({
      where: { id },
      data: { isDeleted: new Date(), status: 'archived' },
    });
    return res.json({ success: true, message: 'تم أرشفة الدعوة وحذفها بأمان' });
  } catch (error) {
    next(error);
  }
}
