import { Request, Response, NextFunction } from 'express';

/**
 * 🛡️ Production-Grade Error Handler
 * Sanitizes error outputs, intercepts database errors, prevents stack trace leakage,
 * and translates technical database errors into safe, user-friendly Arabic messages.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Always log internal details securely on server console (hidden from external clients)
  console.error(`[API Error] [${req.method} ${req.originalUrl}] [IP: ${req.ip}]:`, err?.message || err);

  // 1. Handle Malformed JSON payload attacks
  if (err instanceof SyntaxError && 'body' in err && (err as any).status === 400) {
    return res.status(400).json({
      success: false,
      message: 'صيغة البيانات المرسلة غير صالحة (Malformed JSON Payload)',
    });
  }

  // 2. Handle Prisma Unique Constraint Violation (P2002)
  if (err?.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'القيمة المدخلة مسجلة مسبقاً في النظام ولا يمكن تكرارها (مثل الرابط أو رقم الهاتف أو البريد)',
    });
  }

  // 3. Handle Prisma Record Not Found (P2025)
  if (err?.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'السجل أو البيانات المطلوبة غير موجودة',
    });
  }

  // 4. Handle JWT Token Errors
  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'جلسة الدخول غير صالحة أو منتهية الصلاحية، يرجى تسجيل الدخول مجدداً',
    });
  }

  // 5. General Error Response (strictly mask server internals in production)
  const statusCode = typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const userMessage =
    statusCode < 500
      ? err.message || 'بيانات غير صالحة'
      : isProduction
      ? 'حدث خطأ غير متوقع في الخادم، تم تسجيل المشكلة وجاري المتابعة'
      : err.message || 'حدث خطأ غير متوقع في الخادم';

  return res.status(statusCode).json({
    success: false,
    message: userMessage,
    ...(!isProduction && { stack: err.stack }),
  });
}
