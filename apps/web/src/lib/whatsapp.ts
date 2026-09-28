export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function createInquiryWhatsAppMessage(themeName?: string, eventType?: string): string {
  return `السلام عليكم ورحمة الله ❤️
حابب أعمل دعوة إلكترونية لفرحنا من منصة "فرحنا".
نوع المناسبة: ${eventType || 'فرح / زفاف'}
${themeName ? `التصميم اللي عجبني: ${themeName}\n` : ''}اسم العريس: 
اسم العروسة: 
تاريخ المناسبة التقريبي: 
ممكن تفاصيل الأسعار والخطوات؟`;
}

export function createGuestShareWhatsAppMessage(coupleNames: string, invitationUrl: string): string {
  return `فرحتنا قربت وعقبال عندكم جميعاً ❤️
يسعدنا ويشرفنا حضوركم لتشاركونا أجمل لحظات حياتنا (${coupleNames}).

شوفوا تفاصيل وموقع الفرح بالكامل من هنا:
${invitationUrl}

مستنيينكم تنورونا ✨`;
}
