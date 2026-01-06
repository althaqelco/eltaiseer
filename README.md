# LED Matrix Egypt - Landing Page

موقع مُحسّن للسرعة مع تكامل Google Sheets CRM

## 🚀 النشر على Cloudflare

### 1. نشر الموقع (Static Files) على Cloudflare Pages

```bash
# ارفع المشروع من GitHub
# اذهب إلى: https://dash.cloudflare.com/
# Pages > Create a project > Connect to Git
# اختر: github.com/althaqelco/led
# Build settings:
#   - Build command: (leave empty)
#   - Build output directory: /
```

### 2. نشر API على Cloudflare Workers

```bash
# تثبيت Wrangler CLI
npm install -g wrangler

# تسجيل الدخول
wrangler login

# إضافة Google Credentials كـ Secret
# انسخ محتوى credentials.json كاملاً ثم:
wrangler secret put GOOGLE_CREDENTIALS
# الصق محتوى credentials.json عند السؤال

# نشر Worker
wrangler deploy
```

### 3. تحديث رابط API في الموقع

بعد نشر Worker، ستحصل على رابط مثل:
```
https://led-matrix-api.YOUR-SUBDOMAIN.workers.dev
```

افتح `index.html` وابحث عن `/api/lead` وغيّره إلى:
```javascript
fetch('https://led-matrix-api.YOUR-SUBDOMAIN.workers.dev/api/lead', {
```

ثم ارفع التغييرات:
```bash
git add index.html
git commit -m "Update API endpoint"
git push
```

## 📦 المحتويات

- `index.html` - الصفحة الرئيسية
- `confirm.html` - صفحة تأكيد الطلب
- `worker.js` - Cloudflare Worker API
- `wrangler.toml` - إعدادات Worker
- `images/` - صور WebP محسّنة
- `videos/` - فيديوهات مضغوطة

## ⚡ التحسينات

- ✅ GZIP Compression
- ✅ WebP Images (90% أصغر)
- ✅ Lazy Loading
- ✅ Video Optimization
- ✅ Critical CSS Inline
- ✅ Font Preloading
- ✅ Cache Headers

## 🔒 الأمان

ملف `credentials.json` **غير موجود** في Git للحفاظ على الأمان.
يتم تخزينه كـ Secret في Cloudflare Workers.

## 📞 الدعم

WhatsApp: +20 120 523 4797
