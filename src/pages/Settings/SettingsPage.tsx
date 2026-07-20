// frontend-company/src/pages/Settings/Index.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Card } from '../../components/common/UI/Card';
import { Button } from '../../components/common/UI/Button';
import { Input } from '../../components/common/UI/Input';
import { Alert } from '../../components/common/UI/Alert';
import { Badge } from '../../components/common/UI/Badge';
import {
    Settings,
    Bell,
    User,
    Globe,
    Mail,
    Shield,
    Save,
    CheckCircle,
    Moon,
    Sun,
    Monitor,
    Key,
    BellRing,
    Database,
    Trash2,
    AlertTriangle,
    ChevronLeft,
    Activity,
    Zap,
    Fingerprint,
    Eye,
    EyeOff,
    Camera,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState('general');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        theme: 'light',
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        newApplicationAlerts: true,
        interviewReminders: true,
        marketingEmails: false,
        weeklyReports: true,
        systemUpdates: true,
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        sessionTimeout: '30',
        password: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Profile Settings
    const [profileSettings, setProfileSettings] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: user || '',
        department: '',
    });

    const handleSave = async (section: string) => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaveSuccess(true);
        toast.success(`تنظیمات ${section} با موفقیت ذخیره شد!`);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleProfileUpdate = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaveSuccess(true);
        toast.success('پروفایل با موفقیت بروزرسانی شد!');
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handlePasswordChange = async () => {
        if (securitySettings.newPassword !== securitySettings.confirmPassword) {
            toast.error('رمز عبور با تکرار آن مطابقت ندارد');
            return;
        }
        if (securitySettings.newPassword.length < 6) {
            toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
            return;
        }
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaveSuccess(true);
        toast.success('رمز عبور با موفقیت بروزرسانی شد!');
        setTimeout(() => setSaveSuccess(false), 3000);
        setSecuritySettings({
            ...securitySettings,
            password: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const tabs = [
        { id: 'general', label: 'عمومی', icon: Globe, description: 'زبان، منطقه زمانی، تم' },
        { id: 'notifications', label: 'اعلان‌ها', icon: Bell, description: 'هشدارهای ایمیل و یادآوری‌ها' },
        { id: 'security', label: 'امنیت', icon: Shield, description: 'رمز عبور، احراز هویت دو مرحله‌ای، نشست' },
        { id: 'profile', label: 'پروفایل', icon: User, description: 'اطلاعات شخصی' },
    ];

    return (
        <div className="space-y-6" dir="rtl">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                تنظیمات
                                <Badge variant="gray" size="sm" className="mr-2">
                                    <Activity className="w-3 h-3 ml-1" />
                                    ترجیحات
                                </Badge>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                تنظیمات حساب کاربری و برنامه خود را مدیریت کنید
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        تنظیمات به طور خودکار ذخیره می‌شوند
                    </span>
                </div>
            </div>

            {saveSuccess && (
                <Alert variant="success" className="animate-fade-in">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        تنظیمات با موفقیت ذخیره شد!
                    </div>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <Card className="p-4 h-fit sticky top-24">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                                        isActive
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    )}
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        isActive ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800"
                                    )}>
                                        <Icon className={cn(
                                            "h-4 w-4",
                                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                                        )} />
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="font-medium">{tab.label}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{tab.description}</p>
                                    </div>
                                    <ChevronLeft className={cn(
                                        "h-4 w-4 transition-transform",
                                        isActive ? "text-blue-500" : "text-gray-300 dark:text-gray-600"
                                    )} />
                                </button>
                            );
                        })}
                    </nav>
                </Card>

                {/* Content */}
                <Card className="p-6 lg:col-span-3">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-blue-500" />
                                    تنظیمات عمومی
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">تنظیمات کلی خود را پیکربندی کنید</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        زبان
                                    </label>
                                    <select
                                        value={generalSettings.language}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            language: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="en">انگلیسی</option>
                                        <option value="fa">فارسی</option>
                                        <option value="es">اسپانیایی</option>
                                        <option value="fr">فرانسوی</option>
                                        <option value="de">آلمانی</option>
                                        <option value="zh">چینی</option>
                                        <option value="ja">ژاپنی</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        منطقه زمانی
                                    </label>
                                    <select
                                        value={generalSettings.timezone}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            timezone: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="Asia/Tehran">تهران (IRST)</option>
                                        <option value="America/New_York">شرق آمریکا</option>
                                        <option value="America/Chicago">مرکز آمریکا</option>
                                        <option value="America/Denver">کوهستانی آمریکا</option>
                                        <option value="America/Los_Angeles">غرب آمریکا</option>
                                        <option value="Europe/London">GMT</option>
                                        <option value="Europe/Paris">CET</option>
                                        <option value="Asia/Dubai">GST</option>
                                        <option value="Asia/Tokyo">JST</option>
                                        <option value="Australia/Sydney">AEST</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        فرمت تاریخ
                                    </label>
                                    <select
                                        value={generalSettings.dateFormat}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            dateFormat: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        تم
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setGeneralSettings({ ...generalSettings, theme: 'light' })}
                                            className={cn(
                                                "p-2.5 border-2 rounded-xl flex-1 flex items-center justify-center gap-2 transition-all",
                                                generalSettings.theme === 'light'
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            <Sun className="w-4 h-4" />
                                            <span className="text-sm">روشن</span>
                                        </button>
                                        <button
                                            onClick={() => setGeneralSettings({ ...generalSettings, theme: 'dark' })}
                                            className={cn(
                                                "p-2.5 border-2 rounded-xl flex-1 flex items-center justify-center gap-2 transition-all",
                                                generalSettings.theme === 'dark'
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            <Moon className="w-4 h-4" />
                                            <span className="text-sm">تاریک</span>
                                        </button>
                                        <button
                                            onClick={() => setGeneralSettings({ ...generalSettings, theme: 'system' })}
                                            className={cn(
                                                "p-2.5 border-2 rounded-xl flex-1 flex items-center justify-center gap-2 transition-all",
                                                generalSettings.theme === 'system'
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            <Monitor className="w-4 h-4" />
                                            <span className="text-sm">سیستم</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => handleSave('عمومی')}
                                isLoading={isSaving}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Save className="h-4 w-4" />
                                ذخیره تغییرات
                            </Button>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-blue-500" />
                                    تنظیمات اعلان‌ها
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ترجیحات اعلان‌های خود را مدیریت کنید</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'emailNotifications', label: 'اعلان‌های ایمیل', desc: 'دریافت اعلان‌های ایمیل برای به‌روزرسانی‌های مهم', icon: Mail },
                                    { id: 'newApplicationAlerts', label: 'هشدارهای درخواست جدید', desc: 'هنگام ثبت درخواست جدید اعلان دریافت کنید', icon: BellRing },
                                    { id: 'interviewReminders', label: 'یادآوری مصاحبه', desc: 'یادآوری مصاحبه‌های پیش‌رو را دریافت کنید', icon: Bell },
                                    { id: 'weeklyReports', label: 'گزارش‌های هفتگی', desc: 'دریافت گزارش‌های تحلیلی استخدام هفتگی', icon: Database },
                                    { id: 'systemUpdates', label: 'به‌روزرسانی‌های سیستم', desc: 'از به‌روزرسانی‌های سیستم و ویژگی‌های جدید مطلع شوید', icon: Settings },
                                ].map((item) => {
                                    const isChecked = notificationSettings[item.id as keyof typeof notificationSettings];
                                    return (
                                        <label
                                            key={item.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                                    <item.icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white text-right">{item.label}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{item.desc}</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => setNotificationSettings({
                                                    ...notificationSettings,
                                                    [item.id]: e.target.checked
                                                })}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                            <Button
                                onClick={() => handleSave('اعلان‌ها')}
                                isLoading={isSaving}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Save className="h-4 w-4" />
                                ذخیره تغییرات
                            </Button>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-500" />
                                    تنظیمات امنیت
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">تنظیمات امنیتی خود را مدیریت کنید</p>
                            </div>

                            {/* Change Password */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    تغییر رمز عبور
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            رمز عبور فعلی
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="رمز عبور فعلی را وارد کنید"
                                                value={securitySettings.password}
                                                onChange={(e) => setSecuritySettings({
                                                    ...securitySettings,
                                                    password: e.target.value
                                                })}
                                                className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 pl-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            رمز عبور جدید
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="رمز عبور جدید را وارد کنید"
                                            value={securitySettings.newPassword}
                                            onChange={(e) => setSecuritySettings({
                                                ...securitySettings,
                                                newPassword: e.target.value
                                            })}
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            تکرار رمز عبور جدید
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="رمز عبور جدید را تکرار کنید"
                                            value={securitySettings.confirmPassword}
                                            onChange={(e) => setSecuritySettings({
                                                ...securitySettings,
                                                confirmPassword: e.target.value
                                            })}
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handlePasswordChange}
                                    isLoading={isSaving}
                                >
                                    بروزرسانی رمز عبور
                                </Button>
                            </div>

                            {/* Two-Factor Authentication */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                            <Fingerprint className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white text-right">احراز هویت دو مرحله‌ای</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">یک لایه امنیتی اضافی به حساب خود اضافه کنید</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.twoFactorAuth}
                                        onChange={(e) => setSecuritySettings({
                                            ...securitySettings,
                                            twoFactorAuth: e.target.checked
                                        })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Session Timeout */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    زمان خاتمه نشست (دقیقه)
                                </label>
                                <Input
                                    type="number"
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => setSecuritySettings({
                                        ...securitySettings,
                                        sessionTimeout: e.target.value
                                    })}
                                    placeholder="۳۰"
                                    className="max-w-xs bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                />
                            </div>

                            <Button
                                onClick={() => handleSave('امنیت')}
                                isLoading={isSaving}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Save className="h-4 w-4" />
                                ذخیره تغییرات
                            </Button>

                            {/* Danger Zone */}
                            <div className="border border-red-200 dark:border-red-800 rounded-xl p-4 bg-red-50 dark:bg-red-900/10 mt-6">
                                <h4 className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    منطقه خطر
                                </h4>
                                <p className="text-sm text-red-600 dark:text-red-300 mt-1 text-right">
                                    حساب کاربری و تمام داده‌های مرتبط را به طور دائمی حذف کنید
                                </p>
                                <Button
                                    variant="danger"
                                    className="mt-3 gap-2"
                                    onClick={() => setShowConfirmModal(true)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    حذف حساب
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    تنظیمات پروفایل
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">اطلاعات شخصی خود را مدیریت کنید</p>
                            </div>

                            <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-medium shadow-lg shadow-blue-500/25">
                                    {profileSettings.fullName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-lg text-right">{profileSettings.fullName || 'کاربر'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-right">{profileSettings.email || 'user@company.com'}</p>
                                    <Button variant="outline" size="sm" className="mt-1 gap-1.5">
                                        <Camera className="w-3.5 h-3.5" />
                                        تغییر آواتار
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        نام کامل *
                                    </label>
                                    <Input
                                        type="text"
                                        value={profileSettings.fullName}
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings,
                                            fullName: e.target.value
                                        })}
                                        placeholder="نام کامل خود را وارد کنید"
                                        className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        ایمیل *
                                    </label>
                                    <Input
                                        type="email"
                                        value={profileSettings.email}
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings,
                                            email: e.target.value
                                        })}
                                        placeholder="ایمیل خود را وارد کنید"
                                        disabled
                                        className="bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        تلفن
                                    </label>
                                    <Input
                                        type="tel"
                                        value={profileSettings.phone}
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings,
                                            phone: e.target.value
                                        })}
                                        placeholder="+98 21 1234 5678"
                                        className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        بخش
                                    </label>
                                    <Input
                                        type="text"
                                        value={profileSettings.department}
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings,
                                            department: e.target.value
                                        })}
                                        placeholder="مثال: مهندسی، منابع انسانی"
                                        className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleProfileUpdate}
                                isLoading={isSaving}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Save className="h-4 w-4" />
                                بروزرسانی پروفایل
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Confirm Delete Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">حذف حساب</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-right">
                            آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟ این عمل قابل بازگشت نیست.
                            تمام داده‌های شما، مشاغل، درخواست‌ها و اطلاعات شرکت به طور دائمی حذف خواهند شد.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                انصراف
                            </Button>
                            <Button
                                variant="danger"
                                className="gap-2"
                                onClick={() => {
                                    toast.error('درخواست حذف حساب ثبت شد');
                                    setShowConfirmModal(false);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                حذف حساب
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;