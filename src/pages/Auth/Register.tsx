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
    ArrowRight,
    Shield,
    CheckCircle,
    Fingerprint,
    Zap,
    AlertCircle,
    User,
    Briefcase,
    Phone,
    UserCheck,
    Award,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    company?: string;
    phone?: string;
    role?: 'hiring_manager' | 'recruiter' | 'candidate' | 'admin';
    acceptTerms: boolean;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    company?: string;
    phone?: string;
    acceptTerms?: string;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading, error, success, clearNotifications } = useAuth();

    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        phone: '',
        role: 'hiring_manager',
        acceptTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const [isLoadingSocial, setIsLoadingSocial] = useState<'google' | 'github' | 'linkedin' | null>(null);
    const [passwordStrength, setPasswordStrength] = useState<{
        score: number;
        label: string;
        color: string;
    }>({ score: 0, label: 'Weak', color: 'text-red-500' });

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
                { score: 0, label: 'Very Weak', color: 'text-red-500' },
                { score: 1, label: 'Weak', color: 'text-red-400' },
                { score: 2, label: 'Fair', color: 'text-yellow-500' },
                { score: 3, label: 'Good', color: 'text-blue-500' },
                { score: 4, label: 'Strong', color: 'text-green-500' },
                { score: 5, label: 'Very Strong', color: 'text-green-600' },
            ];

            return strengthMap.find(s => s.score === score) || strengthMap[0];
        };

        if (formData.password) {
            setPasswordStrength(checkPasswordStrength(formData.password));
        } else {
            setPasswordStrength({ score: 0, label: 'Weak', color: 'text-red-500' });
        }
    }, [formData.password]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
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
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                company: formData.company,
                phone: formData.phone,
            });
            navigate('/verify-email', {
                state: {
                    email: formData.email,
                    message: 'Please check your email to verify your account.'
                }
            });
        } catch (err: any) {
            console.error('Registration failed:', err);
        }
    };

    const handleSocialRegister = async (provider: 'google' | 'github' | 'linkedin') => {
        setIsLoadingSocial(provider);
        // Simulate social registration
        setTimeout(() => {
            setIsLoadingSocial(null);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                    Create Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Start your journey with AI-powered recruitment
                </p>

                {/* Feature badges */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        <Shield className="w-3 h-3 text-blue-500" />
                        Secure
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        <Award className="w-3 h-3 text-purple-500" />
                        AI Powered
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        Free Trial
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
                        {/* Name Fields - Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    First Name
                                </label>
                                <div className="mt-1 relative group">
                                    <div className={cn(
                                        "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
                                        isFocused === 'firstName' ? 'text-blue-500' : 'text-gray-400'
                                    )}>
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        onFocus={() => setIsFocused('firstName')}
                                        onBlur={() => setIsFocused(null)}
                                        className={cn(
                                            "pl-8 transition-all duration-200",
                                            isFocused === 'firstName' && "border-blue-500 ring-2 ring-blue-500/20",
                                            errors.firstName && "border-red-500 ring-2 ring-red-500/20"
                                        )}
                                        placeholder="John"
                                        autoComplete="given-name"
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Last Name
                                </label>
                                <div className="mt-1 relative group">
                                    <div className={cn(
                                        "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
                                        isFocused === 'lastName' ? 'text-blue-500' : 'text-gray-400'
                                    )}>
                                        <UserCheck className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        onFocus={() => setIsFocused('lastName')}
                                        onBlur={() => setIsFocused(null)}
                                        className={cn(
                                            "pl-8 transition-all duration-200",
                                            isFocused === 'lastName' && "border-blue-500 ring-2 ring-blue-500/20",
                                            errors.lastName && "border-red-500 ring-2 ring-red-500/20"
                                        )}
                                        placeholder="Doe"
                                        autoComplete="family-name"
                                    />
                                </div>
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="mt-1 relative group">
                                <div className={cn(
                                    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
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
                                        "pl-10 transition-all duration-200",
                                        isFocused === 'email' && "border-blue-500 ring-2 ring-blue-500/20",
                                        errors.email && "border-red-500 ring-2 ring-red-500/20"
                                    )}
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.email}</p>
                            )}
                        </div>

                        {/* Company & Phone - Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Company (Optional)
                                </label>
                                <div className="mt-1 relative group">
                                    <div className={cn(
                                        "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
                                        isFocused === 'company' ? 'text-blue-500' : 'text-gray-400'
                                    )}>
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="company"
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        onFocus={() => setIsFocused('company')}
                                        onBlur={() => setIsFocused(null)}
                                        className={cn(
                                            "pl-8 transition-all duration-200",
                                            isFocused === 'company' && "border-blue-500 ring-2 ring-blue-500/20",
                                            errors.company && "border-red-500 ring-2 ring-red-500/20"
                                        )}
                                        placeholder="Your company"
                                        autoComplete="organization"
                                    />
                                </div>
                                {errors.company && (
                                    <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.company}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone (Optional)
                                </label>
                                <div className="mt-1 relative group">
                                    <div className={cn(
                                        "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
                                        isFocused === 'phone' ? 'text-blue-500' : 'text-gray-400'
                                    )}>
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        onFocus={() => setIsFocused('phone')}
                                        onBlur={() => setIsFocused(null)}
                                        className={cn(
                                            "pl-8 transition-all duration-200",
                                            isFocused === 'phone' && "border-blue-500 ring-2 ring-blue-500/20",
                                            errors.phone && "border-red-500 ring-2 ring-red-500/20"
                                        )}
                                        placeholder="+1 (555) 000-0000"
                                        autoComplete="tel"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative group">
                                <div className={cn(
                                    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
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
                                        "pl-10 pr-10 transition-all duration-200",
                                        isFocused === 'password' && "border-blue-500 ring-2 ring-blue-500/20",
                                        errors.password && "border-red-500 ring-2 ring-red-500/20"
                                    )}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                                            Use at least 8 characters with uppercase, lowercase, number, and special character.
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
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative group">
                                <div className={cn(
                                    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
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
                                        "pl-10 pr-10 transition-all duration-200",
                                        isFocused === 'confirmPassword' && "border-blue-500 ring-2 ring-blue-500/20",
                                        errors.confirmPassword && "border-red-500 ring-2 ring-red-500/20",
                                        formData.confirmPassword && formData.confirmPassword === formData.password && "border-green-500 ring-2 ring-green-500/20"
                                    )}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
                                    Passwords match
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
                            <div className="ml-3 text-sm">
                                <label htmlFor="acceptTerms" className="text-gray-700 dark:text-gray-300">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                        Terms of Service
                                    </Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                        Privacy Policy
                                    </Link>
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
                                Create Account
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                    </form>

                    {/* Social Registration */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => handleSocialRegister('google')}
                                disabled={!!isLoadingSocial}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* {isLoadingSocial === 'google' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Google className="w-5 h-5" />
                )} */}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                                    Google
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialRegister('github')}
                                disabled={!!isLoadingSocial}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* {isLoadingSocial === 'github' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Github className="w-5 h-5" />
                )} */}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                                    GitHub
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialRegister('linkedin')}
                                disabled={!!isLoadingSocial}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* {isLoadingSocial === 'linkedin' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Linkedin className="w-5 h-5" />
                )} */}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                                    LinkedIn
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6">
                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                Sign in
                                <ArrowRight className="inline w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Trust badge */}
                    <div className="mt-6 text-center">
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Secure
                            </span>
                            <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
                            <span className="flex items-center gap-1">
                                <Fingerprint className="w-3 h-3" />
                                Encrypted
                            </span>
                            <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
                            <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                14-day free trial
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;