// frontend-company/src/pages/AI/Index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/UI/Button';
import { Card } from '../../components/common/UI/Card';
import { Badge } from '../../components/common/UI/Badge';
import { ProgressBar } from '../../components/common/UI/ProgressBar';
import {
    Sparkles,
    FileSearch,
    BarChart3,
    FileText,
    ArrowLeft,
    Star,
    Clock,
    CheckCircle,
    Activity,
    Rocket,
    Wand2,
    Loader2,
    Eye,
    ChevronLeft,
    XCircle,
    List,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AITool {
    id: string;
    title: string;
    description: string;
    color: string;
    gradient: string;
    path: string;
    features: string[];
    stats?: {
        label: string;
        value: string;
        change: string;
    };
}

interface Activity {
    id: number;
    title: string;
    score: number | null;
    status: 'completed' | 'in-progress' | 'pending' | 'failed';
    time: string;
    type: 'screening' | 'generation' | 'analytics';
}

const AIPage: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const aiTools: AITool[] = [
        {
            id: 'screening',
            title: 'غربالگری هوش مصنوعی',
            description: 'به طور خودکار داوطلبان را بر اساس نیازمندی‌های شغلی با استفاده از هوش مصنوعی غربال کنید',
            color: 'text-indigo-600 dark:text-indigo-400',
            gradient: 'from-indigo-500 to-purple-600',
            path: '/ai/screening',
            features: [
                'امتیازدهی خودکار داوطلبان',
                'تحلیل تطابق مهارت‌ها',
                'ارزیابی تجربه',
                'غربالگری لحظه‌ای'
            ],
            stats: {
                label: 'داوطلبان غربال شده',
                value: '۱,۲۴۷',
                change: '+۱۲٪'
            }
        },
        {
            id: 'assistant',
            title: 'دستیار شغلی هوش مصنوعی',
            description: 'تولید شرح شغل، نیازمندی‌ها و سوالات مصاحبه با هوش مصنوعی',
            color: 'text-blue-600 dark:text-blue-400',
            gradient: 'from-blue-500 to-cyan-600',
            path: '/ai/assistant',
            features: [
                'تولید شرح شغل',
                'استخراج نیازمندی‌ها',
                'پیشنهاد حقوق',
                'سوالات مصاحبه'
            ],
            stats: {
                label: 'مشاغل ایجاد شده',
                value: '۴۸',
                change: '+۸٪'
            }
        },
        {
            id: 'analytics',
            title: 'تحلیل‌های هوش مصنوعی',
            description: 'با تحلیل‌های مبتنی بر هوش مصنوعی، بینش‌هایی از فرآیند استخدام خود دریافت کنید',
            color: 'text-purple-600 dark:text-purple-400',
            gradient: 'from-purple-500 to-pink-600',
            path: '/ai/analytics',
            features: [
                'روندهای استخدام',
                'بینش‌های داوطلبان',
                'تحلیل بازار',
                'معیارهای عملکرد'
            ],
            stats: {
                label: 'گزارش‌های تولید شده',
                value: '۱۵۶',
                change: '+۵٪'
            }
        }
    ];

    const recentActivities: Activity[] = [
        {
            id: 1,
            title: 'داوطلب برای توسعه‌دهنده ارشد غربال شد',
            score: 85,
            status: 'completed',
            time: '۲ ساعت پیش',
            type: 'screening'
        },
        {
            id: 2,
            title: 'شرح شغل برای مهندس DevOps تولید شد',
            score: null,
            status: 'completed',
            time: '۴ ساعت پیش',
            type: 'generation'
        },
        {
            id: 3,
            title: 'غربالگری هوش مصنوعی برای ۱۵ داوطلب در حال انجام',
            score: null,
            status: 'in-progress',
            time: 'همین الان',
            type: 'screening'
        },
        {
            id: 4,
            title: 'گزارش تحلیلی برای استخدام سه‌ماهه چهارم تولید شد',
            score: 92,
            status: 'completed',
            time: '۶ ساعت پیش',
            type: 'analytics'
        }
    ];

    const quickStats = [
        { label: 'کل غربالگری‌های AI', value: '۱,۲۴۷', change: '+۱۲٪', color: 'text-green-600' },
        { label: 'میانگین امتیاز غربالگری', value: '۷۶٪', change: '+۵٪', color: 'text-green-600' },
        { label: 'مشاغل با AI', value: '۴۸', change: '۷۸٪', color: 'text-blue-600' },
        { label: 'زمان ذخیره شده', value: '~۴۰ ساعت', change: 'با اتوماسیون AI', color: 'text-green-600' },
    ];

    const getStatusIcon = (status: Activity['status']) => {
        switch (status) {
            case 'completed':
                return CheckCircle;
            case 'in-progress':
                return Loader2;
            case 'pending':
                return Clock;
            case 'failed':
                return XCircle;
            default:
                return Clock;
        }
    };

    const getStatusColor = (status: Activity['status']) => {
        switch (status) {
            case 'completed':
                return 'text-green-500 bg-green-50 dark:bg-green-900/20';
            case 'in-progress':
                return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'pending':
                return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
            case 'failed':
                return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            default:
                return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
        }
    };

    const getStatusLabel = (status: Activity['status']) => {
        switch (status) {
            case 'completed':
                return 'تکمیل شده';
            case 'in-progress':
                return 'در حال انجام';
            case 'pending':
                return 'در انتظار';
            case 'failed':
                return 'ناموفق';
            default:
                return status;
        }
    };

    const getTypeIcon = (type: Activity['type']) => {
        switch (type) {
            case 'screening':
                return FileSearch;
            case 'generation':
                return Wand2;
            case 'analytics':
                return BarChart3;
            default:
                return Sparkles;
        }
    };

    return (
        <div className="space-y-8" dir="rtl">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                ابزارهای هوش مصنوعی
                                <Badge variant="info" size="sm" className="mr-2">
                                    <Activity className="w-3 h-3 ml-1" />
                                    زنده
                                </Badge>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                از هوش مصنوعی برای ساده‌سازی فرآیند استخدام خود استفاده کنید
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                viewMode === 'grid'
                                    ? "bg-white dark:bg-gray-700 shadow-sm"
                                    : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <FileText className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                viewMode === 'list'
                                    ? "bg-white dark:bg-gray-700 shadow-sm"
                                    : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/ai/assistant')}
                        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                    >
                        <Wand2 className="h-4 w-4" />
                        امتحان دستیار هوش مصنوعی
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                        <p className={cn("text-xs mt-1", stat.color)}>{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* AI Tools Grid */}
            <div className={cn(
                "grid gap-6",
                viewMode === 'grid'
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
            )}>
                {aiTools.map((tool) => (
                    <div
                        key={tool.id}
                        className={cn(
                            "group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer",
                            viewMode === 'list' && "flex flex-col md:flex-row md:items-center gap-4 p-6"
                        )}
                        onClick={() => navigate(tool.path)}
                    >
                        {/* Gradient overlay */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500",
                            `bg-linear-to-br ${tool.gradient}`
                        )} />

                        <div className={cn(
                            "p-6",
                            viewMode === 'list' && "flex-1"
                        )}>
                            <div className="flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {tool.description}
                                    </p>
                                    {tool.stats && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-gray-400">{tool.stats.label}:</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {tool.stats.value}
                                            </span>
                                            <span className="text-xs text-green-600">
                                                {tool.stats.change}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors shrink-0" />
                            </div>

                            {/* Features */}
                            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {tool.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action */}
                            <Button
                                variant="outline"
                                className="mt-4 w-full gap-2 group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(tool.path);
                                }}
                            >
                                شروع کنید
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-400" />
                            فعالیت‌های اخیر هوش مصنوعی
                        </h2>
                        <Button variant="ghost" size="sm" className="gap-1 text-sm">
                            مشاهده همه
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                        {recentActivities.map((activity) => {
                            const StatusIcon = getStatusIcon(activity.status);
                            const TypeIcon = getTypeIcon(activity.type);
                            const isCompleted = activity.status === 'completed';

                            return (
                                <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={cn(
                                            "p-2 rounded-xl shrink-0",
                                            getStatusColor(activity.status)
                                        )}>
                                            <StatusIcon className={cn(
                                                "w-4 h-4",
                                                activity.status === 'in-progress' && "animate-spin"
                                            )} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate text-right">
                                                    {activity.title}
                                                </p>
                                                <TypeIcon className="w-3 h-3 text-gray-400 shrink-0" />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{activity.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        {activity.score !== null && isCompleted && (
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {activity.score}%
                                                </span>
                                            </div>
                                        )}
                                        <Badge
                                            variant={activity.status === 'completed' ? 'success' : 'warning'}
                                            size="sm"
                                            className="capitalize"
                                        >
                                            {getStatusLabel(activity.status)}
                                        </Badge>
                                        {isCompleted && (
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions / Insights */}
                <div className="space-y-4">
                    <Card className="p-5 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">نکته روز هوش مصنوعی</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    برای تطابق بهتر داوطلبان، از کلمات کلیدی خاص در عناوین شغلی استفاده کنید.
                                </p>
                                <Button size="sm" className="mt-2 px-0 text-blue-600">
                                    بیشتر بدانید
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">استفاده از هوش مصنوعی</h4>
                            <Badge variant="info" size="sm">این ماه</Badge>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">غربالگری‌ها</span>
                                    <span className="font-medium">۷۸٪</span>
                                </div>
                                <ProgressBar value={78} max={100} className="h-1.5 mt-1" color="indigo" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">تولید محتوا</span>
                                    <span className="font-medium">۴۵٪</span>
                                </div>
                                <ProgressBar value={45} max={100} className="h-1.5 mt-1" color="blue" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">تحلیل‌ها</span>
                                    <span className="font-medium">۶۲٪</span>
                                </div>
                                <ProgressBar value={62} max={100} className="h-1.5 mt-1" color="purple" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIPage;