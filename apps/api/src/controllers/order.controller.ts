import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { DEFAULT_SECTIONS } from '@farahna/shared';

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, page = '1', limit = '50', customerId, search } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (customerId) where.customerId = customerId;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string, mode: 'insensitive' } },
        { customer: { name: { contains: search as string, mode: 'insensitive' } } },
        { customer: { phone: { contains: search as string } } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true, phone: true, whatsapp: true },
          },
          invitation: {
            select: { id: true, slug: true, title: true, type: true, status: true },
          },
          payments: {
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        orders,
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

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        invitation: {
          include: {
            events: true,
            theme: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          include: {
            verifiedBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { customerId, packageId, amount, notes, status = 'new', createStarterInvitation } = req.body;
    let initialInvitationId = req.body.invitationId;

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'العميل المحدد غير موجود' });
    }

    const order = await prisma.$transaction(async (tx) => {
      let invitationId = initialInvitationId;

      // Auto-create starter draft invitation if requested or if none provided
      if (!invitationId && createStarterInvitation) {
        const slug = `farah-${customer.phone.replace(/[^0-9]/g, '').slice(-4)}-${Date.now().toString().slice(-4)}`;
        const defaultTheme =
          (await tx.theme.findFirst({ where: { isDefault: true } })) ||
          (await tx.theme.findFirst());

        const invitation = await tx.invitation.create({
          data: {
            customerId: customer.id,
            title: `دعوة فرح - ${customer.name}`,
            type: 'wedding',
            slug,
            status: 'draft',
            eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            coupleGroomAr: customer.name,
            coupleBrideAr: 'العروس',
            themeId: defaultTheme?.id || 'theme-royal-burgundy',
            themeConfig: (defaultTheme?.config as any) || {},
          },
        });
        invitationId = invitation.id;

        await tx.invitationSection.createMany({
          data: DEFAULT_SECTIONS.map((sec, idx) => ({
            invitationId: invitation.id,
            sectionKey: sec.key,
            isEnabled: sec.defaultEnabled,
            sortOrder: idx,
          })),
        });
      }

      const orderNumber = `FARAH-${Date.now().toString().slice(-6)}`;
      return await tx.order.create({
        data: {
          orderNumber,
          customerId,
          invitationId: invitationId || null,
          packageId: packageId || 'wedding-journey',
          amount: Number(amount) || 95,
          currency: 'EGP',
          status: status || 'new',
          notes: notes || null,
        },
        include: {
          customer: true,
          invitation: true,
        },
      });
    });

    return res.status(201).json({ success: true, data: order, message: 'تم إنشاء الطلب بنجاح' });
  } catch (error) {
    next(error);
  }
}

export async function updateOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, notes, amount, packageId, invitationId } = req.body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (amount !== undefined) updateData.amount = Number(amount);
    if (packageId !== undefined) updateData.packageId = packageId;
    if (invitationId !== undefined) updateData.invitationId = invitationId;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        invitation: true,
        payments: true,
      },
    });

    return res.json({ success: true, data: order, message: 'تم تحديث بيانات الطلب بنجاح' });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined && { notes }),
      },
      include: {
        customer: true,
        invitation: true,
      },
    });

    return res.json({ success: true, data: order, message: 'تم تحديث حالة الطلب بنجاح' });
  } catch (error) {
    next(error);
  }
}

export async function deleteOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    return res.json({ success: true, message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    next(error);
  }
}
