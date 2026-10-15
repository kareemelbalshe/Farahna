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
          paymentPhone: '01064906723',
          paymentInstructionsAr:
            'الدفع متاح عبر InstaPay أو فودافون كاش على الرقم 01064906723',
          defaultTimezone: 'Africa/Cairo',
        },
      });
    }
    if (!settings.paymentPhone) {
      settings.paymentPhone = '01064906723';
    }
    return res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      siteName,
      siteNameAr,
      supportPhone,
      whatsappNumber,
      paymentPhone,
      paymentInstructionsAr,
      defaultTimezone,
      defaultDurationDays,
      instagramUrl,
      facebookUrl,
      tiktokUrl,
    } = req.body;

    const data: Record<string, any> = {};
    if (siteName !== undefined) data.siteName = siteName;
    if (siteNameAr !== undefined) data.siteNameAr = siteNameAr;
    if (supportPhone !== undefined) data.supportPhone = supportPhone;
    if (whatsappNumber !== undefined) data.whatsappNumber = whatsappNumber;
    if (paymentPhone !== undefined) data.paymentPhone = paymentPhone;
    if (paymentInstructionsAr !== undefined) data.paymentInstructionsAr = paymentInstructionsAr;
    if (defaultTimezone !== undefined) data.defaultTimezone = defaultTimezone;
    if (defaultDurationDays !== undefined) data.defaultDurationDays = Number(defaultDurationDays);
    if (instagramUrl !== undefined) data.instagramUrl = instagramUrl;
    if (facebookUrl !== undefined) data.facebookUrl = facebookUrl;
    if (tiktokUrl !== undefined) data.tiktokUrl = tiktokUrl;

    const settings = await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: {
        id: 'singleton',
        ...data,
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
