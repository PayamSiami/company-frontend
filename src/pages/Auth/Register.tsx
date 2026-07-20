import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/UI/Button';
import { Input } from '../../components/common/UI/Input';
import { Alert } from '../../components/common/UI/Alert';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    Shield,
    CheckCircle,
    Fingerprint,
    Zap,
    AlertCircle,
    User,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading, error, success, clearNotifications } = useAuth();

    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = useState<{
        score: number;
        label: string;
        color: string;
    }>({ score: 0, label: 'ضعیف', color: 'text-red-500' });

    useEffect(() => {
        return () => clearNotifications();
    }, [clearNotifications]);

    // Password strength checker
    useEffect(() => {
        const checkPasswordStrength = (password: string) => {
            let score = 0;
            if (password.length >= 8) score++;
            if (password.match(/[a-z]+/)) score++;
            if (password.match(/[A-Z]+/)) score++;
            if (password.match(/[0-9]+/)) score++;
            if (password.match(/[$@#&!]+/)) score++;

            const strengthMap = [
                { score: 0, label: 'خیلی ضعیف', color: 'text-red-500' },
                { score: 1, label: 'ضعیف', color: 'text-red-400' },
                { score: 2, label: 'متوسط', color: 'text-yellow-500' },
                { score: 3, label: 'خوب', color: 'text-blue-500' },
                { score: 4, label: 'قوی', color: 'text-green-500' },
                { score: 5, label: 'خیلی قوی', color: 'text-green-600' },
            ];

            return strengthMap.find(s => s.score === score) || strengthMap[0];
        };

        if (formData.password) {
            setPasswordStrength(checkPasswordStrength(formData.password));
        } else {
            setPasswordStrength({ score: 0, label: 'ضعیف', color: 'text-red-500' });
        }
    }, [formData.password]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'نام کاربری الزامی است';
        } else if (formData.username.length < 3) {
            newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'نام کاربری فقط می‌تواند شامل حروف، اعداد و زیرخط باشد';
        }

        if (!formData.email) {
            newErrors.email = 'ایمیل الزامی است';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'لطفاً یک ایمیل معتبر وارد کنید';
        }

        if (!formData.password) {
            newErrors.password = 'رمز عبور الزامی است';
        } else if (formData.password.length < 8) {
            newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
        } else if (!/(?=.*[a-z])/.test(formData.password)) {
            newErrors.password = 'رمز عبور باید حداقل یک حرف کوچک داشته باشد';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد';
        } else if (!/(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'رمز عبور باید حداقل یک عدد داشته باشد';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'تکرار رمز عبور الزامی است';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'پذیرش قوانین و شرایط الزامی است';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: "employer"
            });
            navigate('/verify-email', {
                state: {
                    email: formData.email,
                    message: 'لطفاً برای تأیید حساب کاربری خود، ایمیل خود را بررسی کنید.'
                }
            });
        } catch (err: any) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                    ایجاد حساب کاربری
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    سفر خود را با استخدام مبتنی بر هوش مصنوعی آغاز کنید
                </p>

                {/* Feature badges */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        <Shield className="w-3 h-3 text-blue-500" />
                        امن
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        مبتنی بر AI
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        رایگان
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
                                نام کاربری
                            </label>
                            <div className="mt-1 relative group">
                                <div className={cn(
                                    "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-colors duration-200",
                                    isFocused === 'username' ? 'text-blue-500' : 'text-gray-400'
                                )}>
                                    <User className="h-5 w-5" />
                                </div>
                                <Input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    onFocus={() => setIsFocused('username')}
                                    onBlur={() => setIsFocused(null)}
                                    className={cn(
                                        "pr-10 transition-all duration-200 text-right",
                                        isFocused === 'username' && "border-blue-500 ring-2 ring-blue-500/20",
                                        errors.username && "border-red-500 ring-2 ring-red-500/20"
                                    )}
                                    placeholder="نام کاربری خود را وارد کنید"
                                    autoComplete="username"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.username}</p>
                            )}
                        </div>

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
                                        "pr-10 transition-all duration-200",
                                        isFocused === 'email' && "border-blue-500 ring-2 ring-blue-500/20",
                                        errors.email && "border-red-500 ring-2 ring-red-500/20"
                                    )}
                                    placeholder="example@email.com"
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.email}</p>
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
                                    placeholder="رمز عبور قوی ایجاد کنید"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 left-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-300",
                                                    passwordStrength.color.replace('text-', 'bg-')
                                                )}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className={cn(
                                            "text-xs font-medium",
                                            passwordStrength.color
                                        )}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    {passwordStrength.score < 3 && formData.password.length > 0 && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            حداقل ۸ کاراکتر شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص
                                        </p>
                                    )}
                                </div>
                            )}

                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="flex text-sm font-medium text-gray-700 dark:text-gray-300">
                                تکرار رمز عبور
                            </label>
                            <div className="mt-1 relative group">
                                <div className={cn(
                                    "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-colors duration-200",
                                    isFocused === 'confirmPassword' ? 'text-blue-500' : 'text-gray-400'
                                )}>
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    onFocus={() => setIsFocused('confirmPassword')}
                                    onBlur={() => setIsFocused(null)}
                                    className={cn(
                                        "pr-10 pl-10 transition-all duration-200 text-right",
                                        isFocused === 'confirmPassword' && "border-blue-500 ring-2 ring-blue-500/20",
                                        errors.confirmPassword && "border-red-500 ring-2 ring-red-500/20",
                                        formData.confirmPassword && formData.confirmPassword === formData.password && "border-green-500 ring-2 ring-green-500/20"
                                    )}
                                    placeholder="تکرار رمز عبور"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 left-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label={showConfirmPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.confirmPassword === formData.password && formData.password && (
                                <p className="mt-1 text-xs text-green-600 flex items-center gap-1 animate-fade-in">
                                    <CheckCircle className="w-3 h-3" />
                                    رمز عبور مطابقت دارد
                                </p>
                            )}
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="acceptTerms"
                                    type="checkbox"
                                    checked={formData.acceptTerms}
                                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                    className={cn(
                                        "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-all",
                                        errors.acceptTerms && "border-red-500 ring-2 ring-red-500/20"
                                    )}
                                />
                            </div>
                            <div className="mr-3 text-sm">
                                <label htmlFor="acceptTerms" className="text-gray-700 dark:text-gray-300">
                                    <Link to="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                        قوانین و شرایط
                                    </Link>
                                    {' '}و{' '}
                                    <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                        حریم خصوصی
                                    </Link>
                                    {' '}را می‌پذیرم
                                </label>
                                {errors.acceptTerms && (
                                    <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.acceptTerms}</p>
                                )}
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
                                ایجاد حساب کاربری
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6">
                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            حساب کاربری دارید؟{' '}
                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                وارد شوید
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
                            <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                نسخه آزمایشی رایگان
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;