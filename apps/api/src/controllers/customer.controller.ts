import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export async function getCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isDeleted: false };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string } },
        { whatsapp: { contains: search as string } },
      ];
    }

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { orders: true, invitations: true },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        customers,
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

export async function getCustomerById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { payments: true },
        },
        invitations: {
          where: { isDeleted: null },
          orderBy: { createdAt: 'desc' },
          include: { events: true },
        },
      },
    });

    if (!customer || customer.isDeleted) {
      return res.status(404).json({ success: false, message: 'العميل غير موجود' });
    }

    return res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const customer = await prisma.customer.create({
      data: req.body,
    });
    return res.status(201).json({ success: true, data: customer, message: 'تم إضافة العميل بنجاح' });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.update({
      where: { id },
      data: req.body,
    });
    return res.json({ success: true, data: customer, message: 'تم تحديث بيانات العميل بنجاح' });
  } catch (error) {
    next(error);
  }
}

export async function softDeleteCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.customer.update({
      where: { id },
      data: { isDeleted: true },
    });
    return res.json({ success: true, message: 'تم نقل العميل إلى الأرشيف بنجاح' });
  } catch (error) {
    next(error);
  }
}
