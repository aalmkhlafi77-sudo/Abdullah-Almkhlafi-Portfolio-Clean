# Abdullah Almkhlafi Portfolio — Clean

نسخة مستقلة من مشروع الموقع لإصلاح مسار النشر على Hostinger. المستودع الأصلي والمواقع وقواعد البيانات القديمة ليست جزءاً من هذا النشر التجريبي.

## محلياً

```bash
npm ci
npm test
npm run lint
npm run build
```

الواجهة تُبنى إلى `dist/` والخادم إلى `dist-server/index.js`. تشغيل الخادم يتطلب متغيرات البيئة وقاعدة MySQL مهيأة حسب [دليل Hostinger](docs/deployment/hostinger-clean-launch.md). `.env.example` قالب بلا أسرار؛ لا ترفع ملف `.env` الحقيقي إلى GitHub.
