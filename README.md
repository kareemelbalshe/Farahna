# FARAHNA — فرحنا 💍
## منصة دعوات الزفاف الإلكترونية الفاخرة للسوق المصري

منصة برمجية متكاملة لتقديم دعوات زفاف وخطوبة وفعاليات إلكترونية فاخرة بنموذج الخدمة المُدارة (**Done-For-You Service**)، مصممة بالكامل وفق تقاليد وعادات المجتمع المصري ومجهزة لدعم **رحلة الفرح الكاملة (الخطوبة 💍، ليلة الحنة 🌿، كتب الكتاب 📜، وليلة العمر 👑)** في رابط موحد ذكي لكل عميل.

---

## 🌟 الميزات الجوهرية (Core Features)

1. **رحلة الفرح المتكاملة (Unified Multi-Event Wedding Journey)**:
   - رابط موحد يجمع فعاليات الفرح الأربعة.
   - استقلالية كاملة لكل مناسبة: التاريخ، الوقت، اسم القاعة، الإحداثيات الجغرافية وخريطة تفاعلية مستقلة (Leaflet + OpenStreetMap)، وإضافة مباشرة لتقويم هاتف الضيف (`Google Calendar`, `Apple Calendar`).
2. **نظام دفع إداري آمن (InstaPay & Vodafone Cash) بأعلى درجات الخصوصية**:
   - لا توجد بوابات دفع إلكترونية تقتطع نسباً ولا يتم تخزين أي أرقام حسابات أو محافظ شخصية في النظام أو قاعدة البيانات إطلاقاً.
   - التواصل بشأن أرقام التحويل يتم يدوياً وخارج النظام عبر واتساب مباشرة.
   - يرفع العميل إيصال التحويل، ويفحصه المشرف ويعتمده برقم مرجعي ويتم نشر الدعوة آلياً بنقرة زر واحدة.
3. **تجربة فتح الظرف التفاعلي الفاخر (Animated Luxury Envelope)**:
   - مؤثرات فتح الظرف بختم شمعي ثلاثي الأبعاد واحتفال كونسول ناعم (Confetti).
   - التزام كامل بسياسات المتصفحات العالمية لمنع التشغيل الصوتي التلقائي المزعج إلا بعد نقرة صريحة من الضيف.
4. **٥ ثيمات تصميم مصرية حصرية مع دعم تخصيص الخطوط والألوان**:
   - الملكي البورجوندي (`Royal Burgundy`)
   - الذهبي الفاخر Dark Mode (`Elegant Gold`)
   - الأبيض الهادئ (`Minimal White`)
   - الزهري الرومانسي (`Romantic Floral`)
   - الشرقي التراثي الأصيل (`Egyptian Oriental`)
5. **تأكيد الحضور (RSVP) الذكي والمحمي ضد الـ Spam**:
   - تأكيد عدد المرافقين، الملاحظات والتهاني، وحماية برمجية دقيقة بمعدل الطلبات (Rate Limiting).
   - تصدير كامل لكشوف الضيوف بصيغة CSV أو Excel لتقديمها لمسؤولي قاعة الزفاف.
6. **نظام تحليلات تفصيلي وقمع تحويل ذكي (Funnel Tracking)**:
   - تتبع الزوار والصفحات، النقرات على الموقع الجغرافي، زر واتساب، والمشاركة، دون جمع أي بيانات شخصية متطفلة.
7. **محركات بحث ووسوم تواصل اجتماعي ديناميكية (SEO & Dynamic OG Images)**:
   - توليد بطاقات معاينة تفاعلية مخصصة باسم كل عروسين للظهور على WhatsApp و Facebook.
   - التحكم التلقائي في الفهرسة حسب خصوصية الدعوة (`public` مفهرسة، `unlisted`/`private` محمية بـ `noindex`).
8. **تطبيق ويب تقدمي (PWA) للوحة التحكم**:
   - تثبيت لوحة المشرف كتطبيق مستقل على الهاتف وسطح المكتب مع دعم العمل في وضع عدم الاتصال (`offline fallback`).
9. **تخزين محلي للميديا محمي ومستقل تماماً (Local Storage)**:
   - لا وجود لأي خدمات خارجية مثل Cloudinary، وحفظ الملفات بأسماء UUID آمنة لمنع Path Traversal.

---

## 🛠️ البنية التقنية (Tech Stack)

| الطبقة | التقنيات المستخدمة |
| :--- | :--- |
| **Monorepo** | NPM Workspaces (`packages/shared`, `apps/api`, `apps/web`) |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript, Zod, JWT, BCrypt, Helmet, CORS, Sharp |
| **Database & ORM** | PostgreSQL 16+ مع Prisma ORM |
| **Local Storage** | Local Disk Abstraction مع Persistent Docker Named Volume (`media_storage`) |
| **Maps** | Leaflet + OpenStreetMap مع روابط توجيه Google Maps |
| **Documentation** | Swagger / OpenAPI 3.0 على مسار `/api/docs` |
| **DevOps & Containers** | Docker (Multi-stage builds, Alpine, Non-root users), Docker Compose |

---

## 📁 هيكلية المشروع (Monorepo Architecture)

```
farahna/
├── apps/
│   ├── api/                   # خادم Express REST API
│   │   ├── prisma/            # مخطط الداتابيز ومهاجرات Prisma وسكربت الـ Seed
│   │   ├── src/               # Controllers, Middleware, Routes, Services, Config
│   │   └── storage/           # مجلد التخزين المحلي للميديا المرفوعة
│   └── web/                   # تطبيق Next.js للعملاء ولوحة التحكم
│       ├── public/            # الأيقونات والملفات الثابتة والـ Manifest
│       └── src/
│           ├── app/           # صفحات التطبيق (الدعوات، اللوحة، صفحة الهبوط)
│           ├── components/    # مكونات التصميم والدعوة التفاعلية
│           └── lib/           # عميل الـ API ومساعد رسائل واتساب
├── packages/
│   └── shared/                # المخططات المشتركة والأنواع (Zod Schemas & Types)
├── scripts/
│   ├── backup-db.sh           # سكربت أخذ نسخ احتياطية وضغطها وتنظيف الأقدم من 14 يوم
│   └── deploy.sh              # سكربت النشر الآلي والتحقق من سلامة الخدمات
├── docker-compose.yml         # إعدادات الإنتاج (PostgreSQL + API + Web + Volumes)
├── docker-compose.dev.yml     # إعدادات التطوير المحلي لقاعدة البيانات فقط
├── Dockerfile.api             # صورة الباك إند متعددة المراحل (Alpine, Non-root)
├── Dockerfile.web             # صورة الفرونت إند مع Next.js Standalone
└── .env.example               # نموذج متغيرات البيئة القياسي النظيف
```

---

## ⚙️ متغيرات البيئة (Environment Variables)

قم بإنشاء ملف `.env` في جذر المشروع بالاعتماد على `.env.example`:

```bash
cp .env.example .env
```

### المتغيرات الأساسية للإنتاج:

```env
# Node Environment
NODE_ENV=production
PORT=5000

# Base URLs
SITE_URL=https://farahna.com
API_URL=https://farahna.com/api
CORS_ORIGIN=https://farahna.com,https://admin.farahna.com

# PostgreSQL Database
DATABASE_URL=postgresql://farahna:STRONG_PRODUCTION_PASSWORD@postgres:5432/farahna_db?schema=public

# Security & Secrets (يجب أن تكون نصوص عشوائية قوية لا تقل عن 32 حرف)
JWT_SECRET=super_strong_production_jwt_secret_min_32_characters_long
JWT_EXPIRES_IN=7d
PREVIEW_SECRET=super_strong_production_preview_secret_min_32_characters

# Local Storage
STORAGE_PATH=/app/storage
MAX_FILE_SIZE=10485760

# Public Frontend Envs (تُمرر لـ Next.js أثناء الـ Build)
NEXT_PUBLIC_SITE_URL=https://farahna.com
NEXT_PUBLIC_API_URL=https://farahna.com/api
```

> **ملاحظة أمان هامة**: تم تنظيف كافة المتغيرات الخاصة بـ Cloudinary وأرقام التحويل الشخصية تماماً ولا يوجد أي أثر لها في المشروع.

---

## 🚀 التشغيل في بيئة التطوير المحلي (Local Development)

### 1. تثبيت الحزم وبناء الحزمة المشتركة:
```bash
npm install
npm run build:shared
```

### 2. تشغيل قاعدة البيانات المحلية:
يمكنك استخدام PostgreSQL المثبت على جهازك أو تشغيل حاوية داتابيز التطوير عبر Docker:
```bash
docker compose -f docker-compose.dev.yml up -d
```

### 3. إعداد الجداول والبيانات الأولية (Seed):
```bash
# إنشاء الجداول وتوليد Prisma Client
npm run db:push

# زراعة البيانات الأولية والمشرف الافتراضي والثيمات الخمسة
npm run db:seed
```

### 4. تشغيل السيرفرات في وضع التطوير (Hot Reload):
في شاشتي طرفية منفصلتين:
```bash
# تشغيل خادم Express API (يعمل على http://localhost:5000)
npm run dev:api

# تشغيل واجهة Next.js (تعمل على http://localhost:3000)
npm run dev:web
```

---

## 🚢 التشغيل في بيئة الإنتاج (Production Deployment)

### الخيار الأول: النشر التلقائي عبر Docker Compose (الموصى به)

1. تأكد من إعداد ملف `.env` بالقيم السرية الحقيقية ورابط الدومين.
2. تشغيل سكربت النشر الآلي:
```bash
bash scripts/deploy.sh
```

أو تشغيل الحاويات يدوياً عبر Docker Compose:
```bash
docker compose -f docker-compose.yml up -d --build
```

**مميزات إعداد الـ Docker الإنتاجي:**
- **ديمومة الميديا (Persistence)**: ملفات الوسائط والصور مخزنة في Docker Named Volume باسم `media_storage`، ولن تضيع إطلاقاً عند إعادة بناء أو تحديث الكونتينر.
- **ديمومة الداتابيز**: مجلد بيانات PostgreSQL محفوظ في `postgres_data`.
- **مهاجرات تلقائية للإنتاج**: ينفذ كونتينر الـ API أمر `prisma migrate deploy` تلقائياً قبل بدء التشغيل لضمان اتساق المخطط دون مساس بالبيانات الحية.
- **أمان متقدم**: الحاويات تعمل بمستخدمين غير جذريين (`node` و `nextjs`) مع تقييد صارم للمنافذ.

### الخيار الثاني: البناء والتشغيل اليدوي المستقل (Standalone Build)

```bash
# 1. بناء جميع حزم المشروع
npm run build

# 2. تطبيق المهاجرات على قاعدة البيانات
npm run db:migrate:deploy

# 3. تشغيل الـ API في الإنتاج
cd apps/api && npm run start

# 4. تشغيل الـ Web في الإنتاج
cd apps/web && npm run start
```

---

## 🔒 إعدادات الأمان في وضع الإنتاج

1. **Helmet**: مفعل بإعدادات صارمة تشمل `Cross-Origin-Resource-Policy` و `HSTS` ومنع حقن الـ Headers وحذف `X-Powered-By`.
2. **CORS Lockdown**: في وضع الإنتاج، يُحظر استخدام `*` تماماً ويقتصر الوصول على النطاقات المحددة صراحة في `CORS_ORIGIN`.
3. **Rate Limiting**: مفعل بأربع طبقات حماية:
   - عام: 500 طلب / 15 دقيقة لكل IP.
   - تسجيل الدخول: 5 محاولات / 15 دقيقة لمنع هجمات التخمين.
   - تأكيد الحضور (RSVP): 10 طلبات / 10 دقائق لمنع السبام.
   - التحليلات: 60 حدث / دقيقة.
4. **عزل صور الدفع**: إيصالات السداد لا يتم تخديمها للعامة أبداً، وتتطلب توكن مصادقة إداري `verifyToken` بصلاحية `admin` أو `super_admin`.

---

## 📦 النسخ الاحتياطي لقاعدة البيانات (Database Backups)

تم توفير سكربت مؤتمت لأخذ نسخ احتياطية مضغوطة مع التدوير التلقائي:

```bash
bash scripts/backup-db.sh
```

- يحفظ النسخ في `/backups/farahna` (أو المسار المحدد في `BACKUP_DIR`).
- يقوم بضغط الملف بصيغة `.sql.gz` مع الطابع الزمني.
- يحذف تلقائياً النسخ القديمة التي مر عليها أكثر من 14 يوماً.
- يمكن جدولته في الـ Cron Job اليومي:
```cron
0 3 * * * /bin/bash /path/to/farahna/scripts/backup-db.sh >> /var/log/farahna-backup.log 2>&1
```

---

## 🔑 أول تسجيل دخول للوحة التحكم (Initial Admin Login)

عند تشغيل الـ `seed` لأول مرة، يتم إنشاء حساب المشرف الرئيسي تلقائياً:

- **الرابط**: `https://your-domain.com/admin/login` (أو `http://localhost:3000/admin/login`)
- **البريد الإلكتروني**: `admin@farahna.com`
- **كلمة المرور الافتراضية**: `Farahna@2026!`
- **الصلاحية**: `super_admin`

> ⚠️ **مهم جداً فور أول دخول**:
> 1. توجه إلى صفحة إعدادات المشرف أو غير كلمة المرور لحسابك.
> 2. توجه إلى `إعدادات المنصة` (`/admin/settings`) لتحديث رقم الواتساب الخاص بالدعم واستقبال استفسارات العملاء.
> 3. أرقام الدفع (InstaPay / فودافون كاش) لا تُكتب في النظام؛ النظام يعرض فقط التعليمات العامة للعميل بأن بيانات الدفع ستصله عبر الواتساب مباشرة.

---

## 📖 توثيق الـ API عبر Swagger

التوثيق التفاعلي الكامل متاح مباشرة عبر المتصفح:
- **المسار**: `http://localhost:5000/api/docs` (أو عبر النطاق الإنتاجي)
- يتضمن كافة الـ Endpoints مع المخططات ونماذج الطلبات والاستجابات وطريقة تمرير Bearer JWT Token.

---

## 🧪 الاختبارات وضمان الجودة (Testing)

تم بناء أجنحة اختبار شاملة للتحقق من سلامة كافة الوظائف الحيوية:

```bash
# تشغيل اختبارات الـ API (Vitest + Supertest)
npm run test --workspace=@farahna/api

# تشغيل تقرير التغطية
npm run test:coverage --workspace=@farahna/api

# تشغيل اختبارات E2E (Playwright)
cd apps/web && npx playwright test
```

جميع الاختبارات مستقلة تماماً ومبنية بحيث تنشئ بياناتها ديناميكياً دون الاعتماد على بيانات وهمية مسبقة، مع تغطية كاملة لكافة الحالات الحرجة.
"# Farahna" 
