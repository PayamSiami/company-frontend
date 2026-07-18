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
    ChevronRight,
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
        toast.success(`${section} settings saved successfully!`);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleProfileUpdate = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaveSuccess(true);
        toast.success('Profile updated successfully!');
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handlePasswordChange = async () => {
        if (securitySettings.newPassword !== securitySettings.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (securitySettings.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaveSuccess(true);
        toast.success('Password updated successfully!');
        setTimeout(() => setSaveSuccess(false), 3000);
        setSecuritySettings({
            ...securitySettings,
            password: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Globe, description: 'Language, timezone, theme' },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email alerts and reminders' },
        { id: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA, session' },
        { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Settings
                                <Badge variant="gray" size="sm" className="ml-2">
                                    <Activity className="w-3 h-3 mr-1" />
                                    Preferences
                                </Badge>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                Manage your account and application settings
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        Settings saved automatically
                    </span>
                </div>
            </div>

            {saveSuccess && (
                <Alert variant="success" className="animate-fade-in">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Settings saved successfully!
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
                                    <div className="flex-1 text-left">
                                        <p className="font-medium">{tab.label}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{tab.description}</p>
                                    </div>
                                    <ChevronRight className={cn(
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
                                    General Settings
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Configure your global preferences</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Language
                                    </label>
                                    <select
                                        value={generalSettings.language}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            language: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="zh">Chinese</option>
                                        <option value="ja">Japanese</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Timezone
                                    </label>
                                    <select
                                        value={generalSettings.timezone}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            timezone: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="America/New_York">Eastern Time</option>
                                        <option value="America/Chicago">Central Time</option>
                                        <option value="America/Denver">Mountain Time</option>
                                        <option value="America/Los_Angeles">Pacific Time</option>
                                        <option value="Europe/London">GMT</option>
                                        <option value="Europe/Paris">CET</option>
                                        <option value="Asia/Dubai">GST</option>
                                        <option value="Asia/Tokyo">JST</option>
                                        <option value="Australia/Sydney">AEST</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Date Format
                                    </label>
                                    <select
                                        value={generalSettings.dateFormat}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            dateFormat: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Theme
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
                                            <span className="text-sm">Light</span>
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
                                            <span className="text-sm">Dark</span>
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
                                            <span className="text-sm">System</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => handleSave('general')}
                                isLoading={isSaving}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-blue-500" />
                                    Notification Settings
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your notification preferences</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email notifications for important updates', icon: Mail },
                                    { id: 'newApplicationAlerts', label: 'New Application Alerts', desc: 'Get notified when new applications are submitted', icon: BellRing },
                                    { id: 'interviewReminders', label: 'Interview Reminders', desc: 'Get reminders for upcoming interviews', icon: Bell },
                                    { id: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly hiring analytics reports', icon: Database },
                                    { id: 'systemUpdates', label: 'System Updates', desc: 'Get notified about system updates and new features', icon: Settings },
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
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
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
                                onClick={() => handleSave('notifications')}
                                isLoading={isSaving}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-500" />
                                    Security Settings
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your security preferences</p>
                            </div>

                            {/* Change Password */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    Change Password
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter current password"
                                                value={securitySettings.password}
                                                onChange={(e) => setSecuritySettings({
                                                    ...securitySettings,
                                                    password: e.target.value
                                                })}
                                                className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            New Password
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="Enter new password"
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
                                            Confirm New Password
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="Confirm new password"
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
                                    Update Password
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
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
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
                                    Session Timeout (minutes)
                                </label>
                                <Input
                                    type="number"
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => setSecuritySettings({
                                        ...securitySettings,
                                        sessionTimeout: e.target.value
                                    })}
                                    placeholder="30"
                                    className="max-w-xs bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                />
                            </div>

                            <Button
                                onClick={() => handleSave('security')}
                                isLoading={isSaving}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>

                            {/* Danger Zone */}
                            <div className="border border-red-200 dark:border-red-800 rounded-xl p-4 bg-red-50 dark:bg-red-900/10 mt-6">
                                <h4 className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Danger Zone
                                </h4>
                                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                    Permanently delete your account and all associated data
                                </p>
                                <Button
                                    variant="danger"
                                    className="mt-3 gap-2"
                                    onClick={() => setShowConfirmModal(true)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Account
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
                                    Profile Settings
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information</p>
                            </div>

                            <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-medium shadow-lg shadow-blue-500/25">
                                    {profileSettings.fullName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-lg">{profileSettings.fullName || 'User'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{profileSettings.email || 'user@company.com'}</p>
                                    <Button variant="outline" size="sm" className="mt-1 gap-1.5">
                                        <Camera className="w-3.5 h-3.5" />
                                        Change Avatar
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Full Name *
                                    </label>
                                    <Input
                                        type="text"
                                        value={profileSettings.fullName}
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings,
                                            fullName: e.target.value
                                        })}
                                        placeholder="Your full name"
                                        className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Email *
                                    </label>
                                    <Input
                                        type="email"
                                        value={profileSettings.email}
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings,
                                            email: e.target.value
                                        })}
                                        placeholder="Your email"
                                        disabled
                                        className="bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Phone
                                    </label>
                                    <Input
                                        type="tel"
                                        value={profileSettings.phone}
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings,
                                            phone: e.target.value
                                        })}
                                        placeholder="+1 234 567 890"
                                        className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Department
                                    </label>
                                    <Input
                                        type="text"
                                        value={profileSettings.department}
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings,
                                            department: e.target.value
                                        })}
                                        placeholder="e.g., Engineering, HR"
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
                                Update Profile
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
                            <h3 className="text-lg font-semibold">Delete Account</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to delete your account? This action cannot be undone.
                            All your data, jobs, applications, and company information will be permanently deleted.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                className="gap-2"
                                onClick={() => {
                                    toast.error('Account deletion requested');
                                    setShowConfirmModal(false);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;