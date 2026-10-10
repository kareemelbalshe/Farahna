import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { isValidSafeUrl, normalizeWebUrl } from '@farahna/shared';

export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { date, ...rest } = req.body;

    if (
      !isValidSafeUrl(rest.googleMapsUrl) ||
      !isValidSafeUrl(rest.openStreetMapUrl) ||
      !isValidSafeUrl(rest.imageUrl)
    ) {
      return res.status(400).json({
        success: false,
        message: 'رابط الموقع أو الخريطة غير صالح أو يحتوي على بروتوكول غير آمن',
      });
    }

    if (rest.googleMapsUrl) rest.googleMapsUrl = normalizeWebUrl(rest.googleMapsUrl);
    if (rest.openStreetMapUrl) rest.openStreetMapUrl = normalizeWebUrl(rest.openStreetMapUrl);
    if (rest.imageUrl) rest.imageUrl = normalizeWebUrl(rest.imageUrl);

    const event = await prisma.invitationEvent.create({
      data: {
        ...rest,
        date: new Date(date),
      },
    });

    // Make sure invitation has isMultiEvent set to true if count > 1
    const count = await prisma.invitationEvent.count({
      where: { invitationId: rest.invitationId },
    });
    if (count > 1) {
      await prisma.invitation.update({
        where: { id: rest.invitationId },
        data: { isMultiEvent: true },
      });
    }

    return res.status(201).json({
      success: true,
      data: event,
      message: 'تم إضافة المناسبة بنجاح إلى خطة الحفل',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { date, ...rest } = req.body;

    if (
      (rest.googleMapsUrl !== undefined && !isValidSafeUrl(rest.googleMapsUrl)) ||
      (rest.openStreetMapUrl !== undefined && !isValidSafeUrl(rest.openStreetMapUrl)) ||
      (rest.imageUrl !== undefined && !isValidSafeUrl(rest.imageUrl))
    ) {
      return res.status(400).json({
        success: false,
        message: 'رابط الموقع أو الخريطة غير صالح أو يحتوي على بروتوكول غير آمن',
      });
    }

    if (rest.googleMapsUrl !== undefined) rest.googleMapsUrl = normalizeWebUrl(rest.googleMapsUrl);
    if (rest.openStreetMapUrl !== undefined) rest.openStreetMapUrl = normalizeWebUrl(rest.openStreetMapUrl);
    if (rest.imageUrl !== undefined) rest.imageUrl = normalizeWebUrl(rest.imageUrl);

    const event = await prisma.invitationEvent.update({
      where: { id },
      data: {
        ...rest,
        ...(date && { date: new Date(date) }),
      },
    });

    return res.json({
      success: true,
      data: event,
      message: 'تم تحديث بيانات المناسبة بنجاح',
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const event = await prisma.invitationEvent.delete({
      where: { id },
    });

    // Update isMultiEvent flag on parent invitation
    const count = await prisma.invitationEvent.count({
      where: { invitationId: event.invitationId },
    });
    if (count <= 1) {
      await prisma.invitation.update({
        where: { id: event.invitationId },
        data: { isMultiEvent: false },
      });
    }

    return res.json({
      success: true,
      message: 'تم حذف المناسبة من خطة الحفل بنجاح',
    });
  } catch (error) {
    next(error);
  }
}
