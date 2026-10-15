import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

const DEFAULT_PLANS = [
  {
    name: 'Basic Event',
    nameAr: 'باقة المناسبة الواحدة',
    slug: 'basic',
    price: 50.0,
    currency: 'EGP',
    durationDays: 30,
    features: ['One Main Event', 'Custom Couple Names', 'Location & Map', 'WhatsApp Direct Sharing', 'Countdown Timer'],
    featuresAr: [
      'مناسبة واحدة (فرح أو خطوبة أو كتب كتاب)',
      'تصميم مخصص بأسماء العروسين وصورة الغلاف',
      'قوالب كلاسيكية منسقة بألوانها الأصلية',
      'خطوط عربية قياسية أنيقة (كايرو وأميري)',
      'خريطة تفاعلية وموقع القاعة على Google Maps',
      'عداد تنازلي لموعد الحفل ورابط مشاركة واتساب',
    ],
    badge: 'اقتصادية لمناسبة واحدة 🌸',
    isPopular: false,
    sortOrder: 1,
  },
  {
    name: 'Wedding Journey',
    nameAr: 'باقة رحلة الفرح الشاملة',
    slug: 'wedding-journey',
    price: 95.0,
    currency: 'EGP',
    durationDays: 90,
    features: [
      'Multi-Event Journey',
      '3D Envelope Opening',
      'Curated Colors Customization',
      'Background Music Player',
      'Guest RSVP Form',
      'Add to Calendar',
    ],
    featuresAr: [
      'كل مميزات الباقة الأساسية',
      'تبويبات رحلة الفرح الـ 4 برابط واحد (خطوبة + حنة + كتب كتاب + فرح)',
      'فتح الظرف التفاعلي ثلاثي الأبعاد بجميع حركاته الفاخرة',
      'تخصيص الألوان من الدرجات الملكية والذهبية المقترحة',
      '5 خطوط عربية فاخرة و5 باترنات وأشكال بطاقات مذهبة',
      'مشغل أغاني وموسيقى رومانسية مع خيار رابط MP3',
      'تأكيد الحضور الذكي (RSVP) وحفظ الموعد في التقويم',
    ],
    badge: 'الأكثر طلباً والأفضل قيمة 👑',
    isPopular: true,
    sortOrder: 2,
  },
  {
    name: 'Luxury Custom VIP',
    nameAr: 'باقة التصميم الخاص VIP',
    slug: 'luxury-vip',
    price: 150.0,
    currency: 'EGP',
    durationDays: 180,
    features: [
      'Everything in Journey',
      'Full Free Color Wheel',
      'All 10 Calligraphy Fonts',
      'Photo Session Gallery',
      'Secret Henna Section',
      'Monogram Wax Seal Stamp',
      'Gold Shimmer Effects',
      'Direct MP3 Upload',
    ],
    featuresAr: [
      'كل مميزات باقة رحلة الفرح الشاملة كاملةً',
      'تخصيص حر 100% لعجلة الألوان وكود Hex لجميع التفاصيل',
      'جميع الخطوط الـ 10 وكافة الباترنات والبطاقات الفاخرة',
      'ألبوم صور وجاليري الذكريات (Photo Session Gallery) مع Lightbox',
      'قسم ليلة الحنة المخصص للسيدات مع رمز خصوصية وقفل سري',
      'ختم شمعي مخصص بحروف العروسين للظرف الملكي (Monogram)',
      'تأثيرات البريق والشيمر الذهبي الملكي المتحرك (Gold Sparkles)',
      'رفع ملفات الصوت MP3 وصورة غلاف مخصصة للواتساب',
    ],
    badge: 'فخامة ملكية وتخصيص كامل 💎',
    isPopular: false,
    sortOrder: 3,
  },
];

// Helper to serialize Decimal prices to number
function formatPlan(p: any) {
  return {
    ...p,
    price: Number(p.price),
    priceLabel: `${Number(p.price)} ${p.currency === 'EGP' ? 'ج.م' : p.currency}`,
  };
}

/**
 * Public: Fetch all active pricing plans
 */
export async function getPricingPlans(req: Request, res: Response, next: NextFunction) {
  try {
    let plans = await prisma.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (plans.length === 0) {
      for (const p of DEFAULT_PLANS) {
        await prisma.pricingPlan.upsert({
          where: { slug: p.slug },
          update: p,
          create: p,
        });
      }
      plans = await prisma.pricingPlan.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
    }

    return res.json({
      success: true,
      data: plans.map(formatPlan),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Update single pricing plan by slug or ID
 */
export async function updatePricingPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const { idOrSlug } = req.params;
    const { price, nameAr, name, badge, isPopular, isActive, durationDays, featuresAr } = req.body;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const updateData: any = {};
    if (price !== undefined) updateData.price = Number(price);
    if (nameAr !== undefined) updateData.nameAr = nameAr;
    if (name !== undefined) updateData.name = name;
    if (badge !== undefined) updateData.badge = badge;
    if (isPopular !== undefined) updateData.isPopular = Boolean(isPopular);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (durationDays !== undefined) updateData.durationDays = Number(durationDays);
    if (Array.isArray(featuresAr)) updateData.featuresAr = featuresAr;

    const plan = await prisma.pricingPlan.update({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      data: updateData,
    });

    return res.json({
      success: true,
      data: formatPlan(plan),
      message: `تم تحديث باقة [${plan.nameAr}] بنجاح`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Bulk update prices / details for multiple plans
 */
export async function bulkUpdatePricingPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const { plans } = req.body;
    if (!Array.isArray(plans)) {
      return res.status(400).json({ success: false, message: 'plans must be an array' });
    }

    const updatedList = [];
    for (const item of plans) {
      if (!item.slug) continue;
      const updateData: any = {};
      if (item.price !== undefined) updateData.price = Number(item.price);
      if (item.badge !== undefined) updateData.badge = item.badge;
      if (item.nameAr !== undefined) updateData.nameAr = item.nameAr;
      if (item.isPopular !== undefined) updateData.isPopular = Boolean(item.isPopular);
      if (item.isActive !== undefined) updateData.isActive = Boolean(item.isActive);
      if (item.durationDays !== undefined) updateData.durationDays = Number(item.durationDays);

      const updated = await prisma.pricingPlan.upsert({
        where: { slug: item.slug },
        update: updateData,
        create: {
          slug: item.slug,
          name: item.name || item.slug,
          nameAr: item.nameAr || item.slug,
          price: Number(item.price) || 50,
          currency: 'EGP',
          badge: item.badge,
          isPopular: Boolean(item.isPopular),
        },
      });
      updatedList.push(formatPlan(updated));
    }

    return res.json({
      success: true,
      data: updatedList,
      message: 'تم تحديث أسعار باقات المنصة بنجاح في قاعدة البيانات',
    });
  } catch (error) {
    next(error);
  }
}
