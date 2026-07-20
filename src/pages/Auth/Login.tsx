// frontend-company/src/pages/Auth/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/UI/Button';
import { Input } from '../../components/common/UI/Input';
import { Alert } from '../../components/common/UI/Alert';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Shield,
  CheckCircle,
  Fingerprint,
  Zap,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, success, clearNotifications } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFocused, setIsFocused] = useState<'email' | 'password' | null>(null);
  const [isLoadingSocial, setIsLoadingSocial] = useState<'google' | 'github' | 'linkedin' | null>(null);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    return () => clearNotifications();
  }, [clearNotifications]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'لطفاً یک ایمیل معتبر وارد کنید';
    }
    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login failed:', err);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin') => {
    setIsLoadingSocial(provider);
    // Simulate social login
    setTimeout(() => {
      setIsLoadingSocial(null);
      navigate('/dashboard');
    }, 1500);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">

        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          خوش آمدید
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          برای مدیریت فرصت‌های شغلی و داوطلبان وارد شوید
        </p>

        {/* Feature badges */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
            <Shield className="w-3 h-3 text-blue-500" />
            ورود امن
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
            <CheckCircle className="w-3 h-3 text-green-500" />
            مبتنی بر AI
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
            <Zap className="w-3 h-3 text-yellow-500" />
            بلادرنگ
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-gray-200/50 dark:shadow-gray-950/50 sm:rounded-2xl sm:px-10 border border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
          {/* Success Alert */}
          {success && (
            <Alert variant="success" className="mb-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {success}
              </div>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="error" className="mb-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
                آدرس ایمیل
              </label>
              <div className="mt-1 relative group">
                <div className={cn(
                  "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-colors duration-200",
                  isFocused === 'email' ? 'text-blue-500' : 'text-gray-400'
                )}>
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  className={cn(
                    "pr-10 transition-all duration-200 ltr text-left",
                    isFocused === 'email' && "border-blue-500 ring-2 ring-blue-500/20",
                    errors.email && "border-red-500 ring-2 ring-red-500/20"
                  )}
                  placeholder="example@email.com"
                  autoComplete="email"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
                رمز عبور
              </label>
              <div className="mt-1 relative group">
                <div className={cn(
                  "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-colors duration-200",
                  isFocused === 'password' ? 'text-blue-500' : 'text-gray-400'
                )}>
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  className={cn(
                    "pr-10 pl-10 transition-all duration-200 text-right",
                    isFocused === 'password' && "border-blue-500 ring-2 ring-blue-500/20",
                    errors.password && "border-red-500 ring-2 ring-red-500/20"
                  )}
                  placeholder="رمز عبور خود را وارد کنید"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.password}</p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-all"
                />
                <label htmlFor="remember-me" className="mr-2 flex text-sm text-gray-700 dark:text-gray-300">
                  مرا به خاطر بسپار
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full group relative overflow-hidden transition-all duration-300"
              isLoading={isLoading}
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                ورود
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400">
                  یا ادامه با
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={!!isLoadingSocial}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* {isLoadingSocial === 'google' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Google className="w-5 h-5" />
                )} */}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  گوگل
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={!!isLoadingSocial}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* {isLoadingSocial === 'github' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Github className="w-5 h-5" />
                )} */}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  گیت‌هاب
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('linkedin')}
                disabled={!!isLoadingSocial}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* {isLoadingSocial === 'linkedin' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Linkedin className="w-5 h-5" />
                )} */}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  لینکدین
                </span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              حساب کاربری ندارید؟{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                ایجاد کنید
                <ArrowLeft className="inline w-4 h-4 mr-1" />
              </Link>
            </div>
          </div>

          {/* Trust badge */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                امن
              </span>
              <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
              <span className="flex items-center gap-1">
                <Fingerprint className="w-3 h-3" />
                رمزنگاری شده
              </span>
              <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
              <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                قوانین
              </Link>
              <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
              <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                حریم خصوصی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;