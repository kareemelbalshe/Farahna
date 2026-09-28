import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export async function getPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;

    const [total, payments] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true, phone: true, whatsapp: true },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              invitation: {
                select: { id: true, slug: true, title: true, status: true },
              },
            },
          },
          verifiedBy: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        payments,
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

export async function recordPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const payment = await prisma.payment.create({
      data: req.body,
      include: {
        customer: true,
        order: true,
      },
    });

    // Update order status to proof_received if status was awaiting_payment
    await prisma.order.update({
      where: { id: req.body.orderId },
      data: { status: 'payment_proof_received' },
    });

    return res.status(201).json({
      success: true,
      data: payment,
      message: 'تم تسجيل تحويل InstaPay بنجاح وفي انتظار المراجعة والاعتماد',
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { referenceNumber, notes, publishImmediately = true } = req.body;
    const adminUserId = req.user?.userId;

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id },
        data: {
          status: 'verified',
          verifiedAt: new Date(),
          verifiedById: adminUserId,
          ...(referenceNumber && { referenceNumber }),
          ...(notes && { notes }),
        },
        include: {
          order: {
            include: { invitation: true },
          },
        },
      });

      // Update Order to paid
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: publishImmediately ? 'published' : 'paid',
        },
      });

      // If order has an invitation and publishImmediately is true, publish the invitation!
      if (publishImmediately && payment.order.invitationId) {
        await tx.invitation.update({
          where: { id: payment.order.invitationId },
          data: {
            status: 'published',
          },
        });
      }

      return payment;
    });

    return res.json({
      success: true,
      data: result,
      message: 'تم اعتماد التحويل وتأكيد الدفع بنجاح' + (publishImmediately ? ' ونشر الدعوة مباشرة' : ''),
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status: 'rejected',
        notes: notes || 'تم رفض العملية بعد المراجعة اليدوية',
      },
    });

    return res.json({
      success: true,
      data: payment,
      message: 'تم رفض التحويل وتحديث الحالة',
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { referenceNumber, notes, paymentProofUrl, amount } = req.body;

    const data: any = {};
    if (referenceNumber !== undefined) data.referenceNumber = referenceNumber;
    if (notes !== undefined) data.notes = notes;
    if (paymentProofUrl !== undefined) data.paymentProofUrl = paymentProofUrl;
    if (amount !== undefined) data.amount = Number(amount);

    const payment = await prisma.payment.update({
      where: { id },
      data,
      include: {
        customer: true,
        order: true,
        verifiedBy: true,
      },
    });

    return res.json({
      success: true,
      data: payment,
      message: 'تم تحديث بيانات الدفع بنجاح',
    });
  } catch (error) {
    next(error);
  }
}
