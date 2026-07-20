// frontend-company/src/components/common/Layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Heart,
    Shield,
    FileText,
    HelpCircle,
    Zap,
    Sparkles,
    Briefcase
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface FooterProps {
    className?: string;
    variant?: 'default' | 'minimal' | 'compact';
}

export const Footer: React.FC<FooterProps> = ({
    className = '',
    variant = 'default'
}) => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'ویژگی‌ها', href: '/features' },
            { label: 'قیمت‌گذاری', href: '/pricing' },
            { label: 'یکپارچه‌سازی', href: '/integrations' },
            { label: 'تغییرات', href: '/changelog' },
        ],
        company: [
            { label: 'درباره ما', href: '/about' },
            { label: 'فرصت‌های شغلی', href: '/careers' },
            { label: 'وبلاگ', href: '/blog' },
            { label: 'رسانه', href: '/press' },
        ],
        resources: [
            { label: 'مستندات', href: '/docs' },
            { label: 'مرکز راهنما', href: '/help' },
            { label: 'انجمن', href: '/community' },
            { label: 'وضعیت', href: '/status' },
        ],
        legal: [
            { label: 'حریم خصوصی', href: '/privacy' },
            { label: 'شرایط خدمات', href: '/terms' },
            { label: 'سیاست کوکی', href: '/cookies' },
            { label: 'امنیت', href: '/security' },
        ],
    };

    // Minimal variant - only copyright and legal links
    if (variant === 'minimal') {
        return (
            <footer className={cn(
                "border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-auto",
                className
            )} dir="rtl">
                <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Briefcase className="w-4 h-4" />
                            <span>© {currentYear} JobPortal. تمام حقوق محفوظ است.</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                حریم خصوصی
                            </Link>
                            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                شرایط
                            </Link>
                            <Link to="/help" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                راهنما
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    // Compact variant - simpler with just links
    if (variant === 'compact') {
        return (
            <footer className={cn(
                "border-t border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-900 mt-auto",
                className
            )} dir="rtl">
                <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                        <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            حریم خصوصی
                        </Link>
                        <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            شرایط خدمات
                        </Link>
                        <Link to="/cookies" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            سیاست کوکی
                        </Link>
                        <Link to="/help" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            مرکز راهنما
                        </Link>
                        <Link to="/status" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            وضعیت
                        </Link>
                    </div>
                    <div className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
                        © {currentYear} JobPortal. تمام حقوق محفوظ است.
                    </div>
                </div>
            </footer>
        );
    }

    // Default variant - full footer with links and social
    return (
        <footer className={cn(
            "border-t border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-900 mt-auto",
            className
        )} dir="rtl">
            <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">JobPortal</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">حرفه‌ای</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                            پلتفرم استخدام مبتنی بر هوش مصنوعی که به شما کمک می‌کند بهترین استعدادها را سریع‌تر پیدا کنید.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:col-span-1 lg:col-span-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">محصول</h4>
                            <ul className="space-y-2">
                                {footerLinks.product.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">شرکت</h4>
                            <ul className="space-y-2">
                                {footerLinks.company.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">منابع</h4>
                            <ul className="space-y-2">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">قانونی</h4>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span>© {currentYear} JobPortal. تمام حقوق محفوظ است.</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline text-xs">ساخته شده با <Heart className="w-3 h-3 text-red-500 inline" /> توسط تیم JobPortal</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <Link
                            to="/privacy"
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
                        >
                            <Shield className="w-3.5 h-3.5" />
                            حریم خصوصی
                        </Link>
                        <Link
                            to="/terms"
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            شرایط
                        </Link>
                        <Link
                            to="/help"
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                            راهنما
                        </Link>
                        <span className="text-gray-300 dark:text-gray-700">|</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            نسخه ۲.۴.۱
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Export with variants
export default Footer;