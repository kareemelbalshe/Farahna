import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          siteName: 'Farahna',
          siteNameAr: 'فرحنا',
          supportPhone: '+201019262075',
          whatsappNumber: '201019262075',
          paymentInstructionsAr:
            'الدفع متاح عبر InstaPay أو فودافون كاش على الرقم 01064906723',
          defaultTimezone: 'Africa/Cairo',
        },
      });
    }
    return res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: req.body,
      create: {
        id: 'singleton',
        ...req.body,
      },
    });
    return res.json({
      success: true,
      data: settings,
      message: 'تم تحديث إعدادات المنصة بنجاح',
    });
  } catch (error) {
    next(error);
  }
}
