import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export async function getLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, page = '1', limit = '50', search } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true, phone: true },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        leads,
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

export async function getLeadById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'العميل المحتمل غير موجود' });
    }

    return res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const lead = await prisma.lead.create({
      data: req.body,
    });
    return res.status(201).json({
      success: true,
      data: lead,
      message: 'تم تسجيل العميل المحتمل بنجاح',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLeadStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, notes, name, phone, eventType, source } = req.body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (eventType !== undefined) updateData.eventType = eventType;
    if (source !== undefined) updateData.source = source;

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    return res.json({
      success: true,
      data: lead,
      message: 'تم تحديث بيانات العميل المحتمل ومسار العمل بنجاح',
    });
  } catch (error) {
    next(error);
  }
}

export async function convertLeadToCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { packageId, amount = 95, notes } = req.body;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'العميل المحتمل غير موجود' });
    }

    // 1. Create or retrieve Customer
    let customer;
    if (lead.customerId) {
      customer = await prisma.customer.findUnique({ where: { id: lead.customerId } });
    }
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: lead.name,
          phone: lead.phone,
          whatsapp: lead.whatsapp || lead.phone,
          notes: notes || lead.notes,
          source: lead.source,
          status: 'active',
        },
      });
    }

    // 2. Create Starter Invitation
    const slug = `farah-${lead.phone.replace(/[^0-9]/g, '').slice(-4)}-${Date.now().toString().slice(-4)}`;
    const defaultTheme =
      (await prisma.theme.findFirst({ where: { isDefault: true } })) ||
      (await prisma.theme.findFirst());

    const eventType = (['wedding', 'engagement', 'henna', 'katb_ketab', 'reception', 'custom'].includes(lead.eventType)
      ? lead.eventType
      : 'wedding') as any;

    const invitation = await prisma.invitation.create({
      data: {
        customerId: customer.id,
        title: `دعوة فرح - ${lead.name}`,
        type: eventType,
        slug,
        status: 'draft',
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        coupleGroomAr: lead.name,
        coupleBrideAr: 'العروس',
        themeId: defaultTheme?.id || 'theme-royal-burgundy',
        themeConfig: (defaultTheme?.config as any) || {},
      },
    });

    // 3. Create Order linked to Customer and Invitation
    const orderNumber = `FARAH-${Date.now().toString().slice(-6)}`;
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        invitationId: invitation.id,
        packageId: packageId || 'wedding-journey',
        amount: Number(amount),
        currency: 'EGP',
        status: 'details_received',
        notes: `تم تحويل الطلب تلقائياً من مسار الـ Leads (${lead.name})`,
      },
      include: {
        customer: true,
        invitation: true,
      },
    });

    // 4. Update Lead with customerId & status
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        customerId: customer.id,
        status: 'details_received',
      },
    });

    return res.json({
      success: true,
      data: {
        customer,
        order,
        invitation,
        lead: updatedLead,
      },
      message: 'تم تحويل العميل المحتمل إلى عميل فعلي وإنشاء الطلب والدعوة بنجاح 🎉',
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteLead(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.lead.delete({ where: { id } });
    return res.json({ success: true, message: 'تم حذف العميل المحتمل بنجاح' });
  } catch (error) {
    next(error);
  }
}
