import { ApiError, ApiSessionExpiredError } from './apiClient.js';

export const getLoginFailureMessage = (error: unknown): string => {
  if (error instanceof ApiSessionExpiredError || (error instanceof ApiError && error.status === 401)) {
    return 'اسم المستخدم أو كلمة المرور غير صحيحة.';
  }
  if (error instanceof ApiError && error.status === 403) {
    return 'عنوان الموقع لا يطابق إعداد PUBLIC_ORIGIN؛ تحقق من إعداد النطاق في التطبيق.';
  }
  if (error instanceof ApiError && error.status === 429) {
    return 'تجاوزت عدد محاولات الدخول؛ انتظر 15 دقيقة قبل المحاولة مجدداً.';
  }
  if (error instanceof ApiError) {
    return 'تعذر تسجيل الدخول بسبب خطأ في الخادم؛ افحص سجل تشغيل التطبيق.';
  }
  return 'تعذر الاتصال بالخادم؛ تحقق من تشغيل التطبيق والشبكة.';
};
