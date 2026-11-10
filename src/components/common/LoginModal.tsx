import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, User, KeyRound, Eye, EyeOff, X, ShieldAlert, ArrowLeft } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { 
    showLoginModal, 
    setShowLoginModal, 
    login, 
    theme, 
    setPendingViewAfterAuth 
  } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!username.trim() || !password) {
      setErrorMsg('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    const result = await login(username.trim(), password);
    if (!result.ok) {
      setErrorMsg(result.message);
    } else {
      setUsername('');
      setPassword('');
      setErrorMsg(null);
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setPendingViewAfterAuth(null);
    setErrorMsg(null);
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto p-3 sm:p-6 flex min-h-screen items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
    >
      <div 
        id="admin-login-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md my-auto max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden shrink-0 z-10 transition-all ${
          theme === 'dark' 
            ? 'bg-[#151412] border-[#2E2B26] text-[#F9F7F2]' 
            : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
        }`}
      >
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C5A059] via-[#DFCA9B] to-[#C5A059]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 left-4 p-2 rounded-xl border transition-colors cursor-pointer ${
            theme === 'dark' 
              ? 'border-[#282622] text-[#8E877D] hover:text-white hover:bg-[#201E1A]' 
              : 'border-[#E5E0D8] text-[#5A554E] hover:text-black hover:bg-[#F2EFE9]'
          }`}
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header & Icon */}
        <div className="p-6 sm:p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] mb-4 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif-display tracking-tight mb-1.5">
            تسجيل الدخول للوحة التحكم
          </h3>
          <p className="text-xs text-[#8E877D] dark:text-[#9E988D] max-w-xs leading-relaxed">
            يرجى إدخال بيانات الاعتماد المعتمدة للوصول إلى أدوات تحرير الصفحات، استوديو المحتوى والإعدادات.
          </p>

          {/* Error Banner */}
          {errorMsg && (
            <div className="w-full mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 text-right">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4 text-right">
            
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#C5A059]">
                اسم المستخدم:
              </label>
              <div className="relative">
                <input
                  id="admin-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className={`w-full px-4 py-3 pr-10 rounded-xl text-xs border outline-none font-medium transition-all ${
                    theme === 'dark' 
                      ? 'bg-[#1D1B17] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' 
                      : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                  autoFocus
                />
                <User className="w-4 h-4 text-[#8E877D] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#C5A059]">
                كلمة المرور:
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-10 pl-10 rounded-xl text-xs border outline-none font-medium transition-all ${
                    theme === 'dark' 
                      ? 'bg-[#1D1B17] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' 
                      : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                />
                <KeyRound className="w-4 h-4 text-[#8E877D] absolute right-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E877D] hover:text-[#C5A059] cursor-pointer"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-submit-login-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] transition-all shadow-md mt-4 cursor-pointer active:scale-[0.99]"
            >
              <span>تسجيل الدخول والمتابعة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
