# MySQL Persistence V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** نقل محتوى وإدارة موقع عبدالله المخلافي من localStorage وFirebase إلى Express وMySQL مع مسودات ونشر آمن ومزامنة صحيحة بين الأجهزة.

**Architecture:** يقدم Express واجهات `/api` وملفات Vite المبنية، وتبقى React مسؤولة عن العرض والتحرير فقط. يحفظ MySQL لقطة JSON مرنة للمسودة والمنشور، مع جلسات خادمية وإصدارات وتدقيق ووسائط ثابتة خارج مسار النشر.

**Tech Stack:** React 19، TypeScript 5.8، Vite 6، Express 4، MySQL2، bcryptjs، Cookie آمنة، Multer، file-type، Node test runner، Supertest.

**Spec:** `docs/superpowers/specs/2026-10-04-mysql-persistence-design.md`

## Global Constraints

- التنفيذ على `feature/mysql-persistence-v1` فقط حتى اكتمال التحقق.
- لا يتغير التصميم المرئي أو ترتيب الأقسام أو أدوات التحرير القائمة.
- MySQL هو مصدر الحقيقة الوحيد بعد إغلاق الترحيل.
- لا تُحفظ كلمات المرور أو أسرار MySQL أو معرّفات الجلسات الخام في GitHub أو localStorage.
- لا تظهر رسالة نجاح إلا بعد نجاح استجابة الخادم.
- الزوار يقرأون `published_json` فقط، والمسؤول يحرر `draft_json`.
- لا تُحذف Firebase أو بيانات المتصفح القديمة قبل نجاح التحقق من جهاز ثانٍ.
- الصور النهائية ملفات ثابتة وليست Base64 أو `blob:`.
- كل سلوك جديد يبدأ باختبار فاشل ثم أقل تنفيذ يجعله ينجح.
- يجب أن تنجح `npm test` و`npm run lint` و`npm run build` قبل الدمج.

## Review Focus

- لقطة JSON تالفة أو ضخمة أو تحتوي بيانات دخول: تُرفض دون كتابة جزئية — يغطيها Task 1.
- حفظ من جهازين بإصدار قديم: يعاد `409` ولا يُستبدل المحتوى الأحدث — يغطيها Task 4.
- فشل خطوة داخل معاملة النشر: يبقى المنشور السابق دون تغيير — يغطيها Task 4.
- جلسة منتهية أو طلب تعديل من Origin غير مصرح: يعاد `401/403` — يغطيها Task 3 وTask 6.
- صورة مزيفة أو `blob:` أو حذف صورة مستخدمة: تُرفض العملية وتحفظ المراجع — يغطيها Task 5.

## File Structure

- `server/config.ts`: التحقق من متغيرات البيئة.
- `server/db.ts`: إنشاء MySQL pool.
- `server/db/schema.sql`: نسخة متكررة التنفيذ من المخطط المنشأ.
- `server/auth/*`: كلمات المرور والجلسات ومسارات المصادقة.
- `server/content/*`: نموذج اللقطة ومستودع المحتوى والحفظ والنشر.
- `server/media/*`: فحص الصور والتخزين والحذف.
- `server/migration/*`: استيراد JSON وتحويل الصور المضمنة.
- `server/audit/*`: كتابة سجل التدقيق.
- `server/app.ts`: تركيب Express والوسائط والمسارات.
- `server/index.ts`: تشغيل الخادم.
- `server/scripts/*`: إنشاء المسؤول وفحص قاعدة البيانات.
- `src/lib/apiClient.ts`: عميل HTTP موحد.
- `src/lib/portfolioSnapshot.ts`: جمع وتطبيق لقطة الموقع.
- `src/lib/legacyMigration.ts`: قراءة الحقول القديمة ودمجها صراحة.
- `src/context/AppContext.tsx`: تحويل الحالة والمصادقة إلى API.
- `src/components/common/LoginModal.tsx`: دخول غير متزامن.
- `src/components/common/SettingsModal.tsx`: الاستيراد والتصدير والترحيل.
- `.github/workflows/ci.yml`: فحص تلقائي للفرع وطلبات الدمج.

---

### Task 1: Test Harness and Portfolio Snapshot Contract

**Files:**
- Modify: `package.json`
- Create: `package-lock.json`
- Create: `server/content/schema.ts`
- Create: `server/content/schema.test.ts`
- Create: `src/lib/portfolioSnapshot.ts`
- Create: `src/lib/portfolioSnapshot.test.ts`

**Interfaces:**
- Produces: `PortfolioSnapshotV1`, `validatePortfolioSnapshot(input, maxBytes)`, `createPortfolioSnapshot(state)`.
- Consumes: أنواع المحتوى الحالية من `src/types.ts`.

- [ ] **Step 1: Add failing snapshot validation tests**

اختبر قبول لقطة كاملة، ورفض جذر غير كائن، و`schemaVersion` غير 1، وحجم أكبر من 25 MiB، وأي مفاتيح `adminCredentials` أو `password` داخل الجذر.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `node --import tsx --test server/content/schema.test.ts src/lib/portfolioSnapshot.test.ts`  
Expected: FAIL لأن الوحدات غير موجودة.

- [ ] **Step 3: Implement the contract and test scripts**

وحّد مدير الحزم على npm وأنشئ `package-lock.json`، ثم أضف `test: node --import tsx --test`. عرّف `PortfolioSnapshotV1` بجميع حقول الوثيقة، واجعل `validatePortfolioSnapshot` يعيد لقطة منقحة أو يرمي `SnapshotValidationError`.

- [ ] **Step 4: Verify GREEN and type safety**

Run: `npm test && npm run lint`  
Expected: PASS دون تحذيرات TypeScript.

- [ ] **Step 5: Commit**

`git commit -m "test: define portfolio snapshot contract"`

---

### Task 2: Runtime Configuration and MySQL Foundation

**Files:**
- Modify: `package.json`
- Modify: `.env.example`
- Modify: `.gitignore`
- Create: `server/config.ts`
- Create: `server/config.test.ts`
- Create: `server/db.ts`
- Create: `server/db/schema.sql`
- Create: `server/scripts/check-db.ts`

**Interfaces:**
- Produces: `loadConfig(env): AppConfig`, `createDbPool(config): Pool`, `checkDatabase(pool): Promise<DatabaseHealth>`.
- Consumes: أسماء الجداول الستة المنشأة في Hostinger.

- [ ] **Step 1: Add failing configuration tests**

اختبر رفض غياب `DB_PASSWORD` أو `PUBLIC_ORIGIN`، وقبول `DB_HOST=127.0.0.1` و`DB_PORT=3306` دون طباعة كلمة المرور.

- [ ] **Step 2: Verify RED**

Run: `node --import tsx --test server/config.test.ts`  
Expected: FAIL لأن `loadConfig` غير موجودة.

- [ ] **Step 3: Implement configuration, pool, schema copy, and health check**

أضف `mysql2`. يجب أن يتحقق `checkDatabase` من الاتصال ووجود الجداول الستة وسجل `main_site` دون تعديل البيانات.

- [ ] **Step 4: Verify locally without production secrets**

Run: `npm test && npm run lint`  
Expected: PASS؛ فحص MySQL الفعلي يؤجل إلى Hostinger حيث تُدخل المتغيرات.

- [ ] **Step 5: Commit**

`git commit -m "feat: add MySQL configuration foundation"`

---

### Task 3: Server-Side Admin Authentication

**Files:**
- Create: `server/auth/types.ts`
- Create: `server/auth/repository.ts`
- Create: `server/auth/mysqlRepository.ts`
- Create: `server/auth/password.ts`
- Create: `server/auth/session.ts`
- Create: `server/auth/middleware.ts`
- Create: `server/auth/routes.ts`
- Create: `server/auth/auth.test.ts`
- Create: `server/scripts/create-admin.ts`

**Interfaces:**
- Produces: `AuthRepository`, `createAuthRouter(deps)`, `requireAdmin(deps)`, `hashPassword`, `verifyPassword`.
- Cookie: `portfolio_admin_session`، مدة 8 ساعات، `HttpOnly; Secure; SameSite=Strict`.
- Consumes: `admins` و`admin_sessions`.

- [ ] **Step 1: Add failing authentication tests**

اختبر الدخول الصحيح والخاطئ، عدم كشف سبب الفشل، الجلسة المنتهية، الخروج، إلغاء جميع الجلسات عند تغيير كلمة المرور، ورفض المسارات المحمية دون Cookie.

- [ ] **Step 2: Verify RED**

Run: `node --import tsx --test server/auth/auth.test.ts`  
Expected: FAIL لأن Router ومستودع المصادقة غير موجودين.

- [ ] **Step 3: Implement authentication and one-time admin creation**

أضف `bcryptjs` و`cookie-parser` و`express-rate-limit`. يخزن الجدول SHA-256 لمعرّف جلسة عشوائي من 32 بايت، ولا يطبع البرنامج السر الخام.

- [ ] **Step 4: Verify GREEN**

Run: `npm test && npm run lint`  
Expected: PASS بما فيه انتهاء الجلسة وتغيير كلمة المرور.

- [ ] **Step 5: Commit**

`git commit -m "feat: add secure admin authentication"`

---

### Task 4: Draft, Publish, Version, and Restore Services

**Files:**
- Create: `server/content/types.ts`
- Create: `server/content/repository.ts`
- Create: `server/content/mysqlRepository.ts`
- Create: `server/content/service.ts`
- Create: `server/content/routes.ts`
- Create: `server/content/content.test.ts`
- Create: `server/audit/repository.ts`
- Create: `server/audit/mysqlRepository.ts`

**Interfaces:**
- Produces: `ContentService.getPublished()`, `getDraft(adminId)`, `saveDraft(snapshot, expectedVersion, adminId)`, `publish(expectedDraftVersion, adminId, note)`, `restore(versionId, adminId)`.
- Errors: `ContentConflictError` → 409، `ContentNotPublishedError` → 404.
- Consumes: `site_documents` و`content_versions` و`audit_logs`.

- [ ] **Step 1: Add failing content lifecycle tests**

اختبر أن حفظ المسودة لا يغير المنشور، وأن الإصدار القديم يعيد تعارضًا، وأن النشر ينشئ نسخة وسجل تدقيق، وأن فشل أي خطوة في المعاملة يبقي المنشور السابق، وأن الاستعادة تنشئ مسودة جديدة دون نشر تلقائي.

- [ ] **Step 2: Verify RED**

Run: `node --import tsx --test server/content/content.test.ts`  
Expected: FAIL لأن `ContentService` غير موجود.

- [ ] **Step 3: Implement service, router, and transactional MySQL repository**

استخدم `SELECT ... FOR UPDATE` داخل معاملة النشر. تعيد `GET /api/public/content` المنشور فقط، وتبقى جميع عمليات الإدارة خلف `requireAdmin`.

- [ ] **Step 4: Verify GREEN**

Run: `npm test && npm run lint`  
Expected: PASS مع إثبات rollback في اختبار الفشل.

- [ ] **Step 5: Commit**

`git commit -m "feat: add versioned draft and publish workflow"`

---

### Task 5: Media Storage and JSON Import

**Files:**
- Create: `server/media/types.ts`
- Create: `server/media/repository.ts`
- Create: `server/media/mysqlRepository.ts`
- Create: `server/media/storage.ts`
- Create: `server/media/routes.ts`
- Create: `server/media/media.test.ts`
- Create: `server/migration/importSnapshot.ts`
- Create: `server/migration/importSnapshot.test.ts`

**Interfaces:**
- Produces: `storeImage(buffer, detectedType, uploadRoot)`, `importSnapshot(input, deps)`, `isMediaReferenced(snapshot, url)`.
- Consumes: `media_files` و`ContentService.saveDraft`.
- أنواع الصور: JPEG، PNG، WebP، GIF؛ الحد 10 MiB.

- [ ] **Step 1: Add failing media and import tests**

اختبر فحص التوقيع الحقيقي للملف، منع المسارات المتلاعبة و`blob:`، تحويل `data:image/*;base64` إلى رابط `/media/*`، تنظيف الملفات عند فشل الاستيراد، ومنع حذف صورة مستخدمة في المسودة أو المنشور.

- [ ] **Step 2: Verify RED**

Run: `node --import tsx --test server/media/media.test.ts server/migration/importSnapshot.test.ts`  
Expected: FAIL لأن وحدات التخزين والاستيراد غير موجودة.

- [ ] **Step 3: Implement media storage and import**

أضف `multer` و`file-type`. استخدم أسماء عشوائية ومسار `UPLOAD_ROOT` خارج مجلد النشر، وحدّث `media_files` فقط بعد نجاح كتابة الملف.

- [ ] **Step 4: Verify GREEN**

Run: `npm test && npm run lint`  
Expected: PASS واختبارات الملفات تستخدم مجلدًا مؤقتًا يُنظف بعد الاختبار.

- [ ] **Step 5: Commit**

`git commit -m "feat: add persistent media and snapshot import"`

---

### Task 6: Express Application, Security Boundary, and Production Build

**Files:**
- Modify: `package.json`
- Create: `server/app.ts`
- Create: `server/app.test.ts`
- Create: `server/index.ts`
- Create: `server/security/originGuard.ts`
- Create: `server/security/originGuard.test.ts`

**Interfaces:**
- Produces: `createApp(deps): Express`.
- Routes: `/api/health`، `/api/public`، `/api/auth`، `/api/admin`، `/media`، ثم Vite SPA fallback.
- Build output: `dist` للواجهة و`dist-server/index.js` للخادم.

- [ ] **Step 1: Add failing application boundary tests**

اختبر `503` عند فشل MySQL، و`403` لطلبات التعديل من Origin مختلف، والسماح للقراءة العامة، وحد JSON الأقصى 25 MiB، وعدم إرجاع stack trace.

- [ ] **Step 2: Verify RED**

Run: `node --import tsx --test server/app.test.ts server/security/originGuard.test.ts`  
Expected: FAIL لأن التطبيق غير مركب.

- [ ] **Step 3: Implement Express assembly and build commands**

أضف `helmet` وSupertest. اجعل `build` يشغل Vite ثم esbuild للخادم، و`start` يشغل `node dist-server/index.js` ويستمع إلى `process.env.PORT`.

- [ ] **Step 4: Verify GREEN and production build**

Run: `npm test && npm run lint && npm run build`  
Expected: PASS ووجود `dist/index.html` و`dist-server/index.js`.

- [ ] **Step 5: Commit**

`git commit -m "feat: assemble secure production server"`

---

### Task 7: Client API, Server-Owned Login, and Content Loading

**Files:**
- Create: `src/lib/apiClient.ts`
- Create: `src/lib/apiClient.test.ts`
- Modify: `src/context/AppContext.tsx`
- Modify: `src/components/common/LoginModal.tsx`
- Modify: `src/components/common/TopGlobalBar.tsx`
- Modify: `src/components/common/SettingsModal.tsx`

**Interfaces:**
- Produces: `apiClient.publicContent()`, `login()`, `logout()`, `me()`, `getDraft()`, `saveDraft()`, `publish()`, `restoreVersion()`, `importContent()`, `exportContent()`, `uploadMedia()`, `deleteMedia()`, `changePassword()`.
- Changes: `login` يصبح `Promise<boolean>`؛ `saveDraft` و`publishChanges` لا يغيران حالة النجاح قبل رد الخادم.
- Consumes: واجهات Tasks 3 و4 و6.

- [ ] **Step 1: Add failing API client tests**

اختبر إرسال Cookie، وتحويل 409 إلى `ApiConflictError`، وتحويل 401 إلى انتهاء جلسة، وبقاء الحالة `unsaved` عند 500، وعدم عرض نجاح وهمي.

- [ ] **Step 2: Verify RED**

Run: `node --import tsx --test src/lib/apiClient.test.ts`  
Expected: FAIL لأن `apiClient` غير موجود.

- [ ] **Step 3: Implement API client and replace AppContext persistence**

أزل المصادقة المحلية وكتابة المحتوى الدائم المباشرة. حمّل المنشور للعامة، وحمّل المسودة بعد دخول الإدارة، مع Cache قراءة أخير فقط عند تعطل الشبكة.

- [ ] **Step 4: Verify GREEN and UI compilation**

Run: `npm test && npm run lint && npm run build`  
Expected: PASS دون أخطاء نتيجة تحويل `login` إلى async.

- [ ] **Step 5: Commit**

`git commit -m "refactor: move portfolio state to server API"`

---

### Task 8: Legacy Migration, Complete Backup, and Cleanup Controls

**Files:**
- Create: `src/lib/legacyMigration.ts`
- Create: `src/lib/legacyMigration.test.ts`
- Modify: `src/context/AppContext.tsx`
- Modify: `src/components/common/SettingsModal.tsx`

**Interfaces:**
- Produces: `readLegacySnapshot(storage)`, `mergeMissingLegacyFields(server, legacy)`, `clearLegacyPersistence(storage)`.
- الدمج صريح ولا يستبدل حقول الخادم غير الفارغة.
- Consumes: `PortfolioSnapshotV1` و`apiClient.importContent`.

- [ ] **Step 1: Add failing migration tests**

اختبر تضمين `heroConfig` و`brandVideoUrl` في النسخ الجديدة، وعدم نسخ بيانات الدخول، وعدم استبدال خادم ممتلئ، وعدم مسح المفاتيح قبل تأكيد التحقق.

- [ ] **Step 2: Verify RED**

Run: `node --import tsx --test src/lib/legacyMigration.test.ts`  
Expected: FAIL لأن وحدة الترحيل غير موجودة.

- [ ] **Step 3: Implement explicit migration controls**

أضف في تبويب النسخ الاحتياطي: استيراد إلى المسودة، معاينة الفروق، دمج الحقول الناقصة، تصدير شامل، وزر تنظيف قديم لا يتاح إلا بعد تأكيد نجاح جهاز ثانٍ.

- [ ] **Step 4: Verify GREEN**

Run: `npm test && npm run lint && npm run build`  
Expected: PASS وتبقى Firebase موجودة مؤقتًا حتى Task 9.

- [ ] **Step 5: Commit**

`git commit -m "feat: add controlled legacy content migration"`

---

### Task 9: Firebase Removal, CI, and Hostinger Runbook

**Files:**
- Delete: `src/lib/firebaseClient.ts`
- Delete: `firebase-applet-config.json`
- Delete: `firebase-blueprint.json`
- Delete: `firestore.rules`
- Delete: `bun.lock`
- Modify: `package.json`
- Create: `.github/workflows/ci.yml`
- Create: `docs/deployment/hostinger-node-app.md`

**Interfaces:**
- Produces: مشروع بلا اتصالات Firebase ومسار نشر موثق.
- Consumes: جميع مهام 1–8.

- [ ] **Step 1: Add the final regression check**

أضف فحصًا يفشل إذا ظهر استيراد `firebase` أو `safeSetDoc` أو كتابة `ADMIN_CREDS` في `src` أو `server`، مع السماح بذكرها في وثائق الترحيل.

- [ ] **Step 2: Verify RED before removal**

Run: `npm test`  
Expected: FAIL لأن مراجع Firebase القديمة ما زالت موجودة.

- [ ] **Step 3: Remove Firebase and add CI/runbook**

احذف الاعتماد والملفات، وأضف CI يشغل `npm ci` ثم test/lint/build. وثق إعداد تطبيق Hostinger التجريبي، المتغيرات دون قيم سرية، إنشاء المسؤول، `db:check`، الاستيراد، اختبارات جهازين، التحويل والرجوع.

- [ ] **Step 4: Run complete verification**

Run: `npm test && npm run lint && npm run build && npm audit --omit=dev`  
Expected: جميع الاختبارات والبناء ناجحة؛ أي ثغرة High أو Critical تمنع التسليم.

- [ ] **Step 5: Commit**

`git commit -m "chore: remove Firebase and document Hostinger deployment"`

---

## Final Branch Verification

- [ ] مراجعة الفرق مع `main` والتأكد من عدم وجود أسرار أو ملفات رفع.
- [ ] تشغيل الاختبارات والفحص والبناء من تثبيت نظيف.
- [ ] فتح Pull Request من `feature/mysql-persistence-v1` إلى `main`.
- [ ] انتظار CI وعدم الدمج قبل نجاحها.
- [ ] نشر الفرع على تطبيق Hostinger تجريبي وإدخال المتغيرات هناك فقط.
- [ ] تشغيل `/api/health` و`db:check`.
- [ ] إنشاء المسؤول الأول ثم حذف كلمة مروره الأولية من متغيرات البيئة.
- [ ] استيراد JSON كمسودة وفحص المحتوى.
- [ ] نشر المحتوى والتحقق من نافذة خاصة وجهاز ثانٍ.
- [ ] تنفيذ فحص النص والصورة والخدمة والمقال والمشروع والحذف وإعادة التحميل.
- [ ] دمج PR وربط النطاق الأصلي فقط بعد نجاح جميع البنود.

