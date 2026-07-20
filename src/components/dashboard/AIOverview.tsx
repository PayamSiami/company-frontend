// frontend-company/src/components/dashboard/AIOverview.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Clock,
    CheckCircle,
    ChartBarIcon,
    Zap,
    TrendingUp,
    Award,
    Brain,
    Activity,
    RefreshCw,
    BarChart3,
    ChevronLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../common/UI/Card';
import { Badge } from '../common/UI/Badge';
import { Button } from '../common/UI/Button';
import { ProgressBar } from '../common/UI/ProgressBar';
import { cn } from '../../lib/utils';
import type { AIScreeningDataDto } from '../../types';

interface AIOverviewProps {
    data: AIScreeningDataDto;
    className?: string;
    onRefresh?: () => void;
}

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
    progress?: number;
    trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    progress,
    trend
}) => (
    <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</span>
            <div className={cn("p-2 rounded-lg", color)}>
                <Icon className="h-5 w-5 text-white" />
            </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
        )}
        {progress !== undefined && (
            <div className="mt-2">
                <ProgressBar value={progress} max={100} className="h-1.5" color={color as any} />
            </div>
        )}
        {trend !== undefined && (
            <p className={cn(
                "text-xs mt-1 font-medium",
                trend >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% نسبت به ماه قبل
            </p>
        )}
    </div>
);

export const AIOverview: React.FC<AIOverviewProps> = ({
    data,
    className = '',
    onRefresh
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

    const {
        screeningCoverage,
        totalCandidatesScreened,
        candidatesNotScreened,
        pendingScreening = [],
        screeningHistory = []
    } = data || {};

    const handleRefresh = async () => {
        setIsRefreshing(true);
        if (onRefresh) await onRefresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const totalCandidates = totalCandidatesScreened + candidatesNotScreened;
    const averageScore = screeningHistory.length > 0
        ? screeningHistory.reduce((sum, job) => sum + job.avgScore, 0) / screeningHistory.length
        : 0;

    const highMatch = screeningHistory.filter(job => job.avgScore >= 70).length;
    const mediumMatch = screeningHistory.filter(job => job.avgScore >= 40 && job.avgScore < 70).length;
    const lowMatch = screeningHistory.filter(job => job.avgScore < 40).length;

    const stats = [
        {
            title: 'پوشش غربالگری',
            value: `${Math.round(screeningCoverage)}%`,
            icon: ChartBarIcon,
            color: 'bg-indigo-500',
            subtitle: `${totalCandidatesScreened} از ${totalCandidates} غربال شده`,
            progress: screeningCoverage,
            trend: 8
        },
        {
            title: 'داوطلبان غربال شده',
            value: totalCandidatesScreened || 0,
            icon: CheckCircle,
            color: 'bg-green-500',
            subtitle: 'توسط هوش مصنوعی',
            trend: 12
        },
        {
            title: 'در انتظار غربالگری',
            value: candidatesNotScreened || 0,
            icon: Clock,
            color: 'bg-yellow-500',
            subtitle: 'در انتظار تحلیل',
            trend: -5
        },
        {
            title: 'میانگین امتیاز تطابق',
            value: `${Math.round(averageScore)}%`,
            icon: Award,
            color: 'bg-purple-500',
            subtitle: `بر اساس ${screeningHistory.length} شغل`,
            trend: 3
        },
    ];

    return (
        <Card className={cn("overflow-hidden", className)} dir="rtl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-indigo-500" />
                        نمای کلی غربالگری هوش مصنوعی
                        <Badge variant="info" size="sm" className="mr-2">
                            <Activity className="w-3 h-3 ml-1" />
                            زنده
                        </Badge>
                    </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button
                            onClick={() => setViewMode('overview')}
                            className={cn(
                                "px-2 py-1 text-xs font-medium rounded transition-colors",
                                viewMode === 'overview'
                                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            نمای کلی
                        </button>
                        <button
                            onClick={() => setViewMode('detailed')}
                            className={cn(
                                "px-2 py-1 text-xs font-medium rounded transition-colors",
                                viewMode === 'detailed'
                                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            جزئیات
                        </button>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-8 w-8 p-0"
                    >
                        <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Match Distribution */}
                {viewMode === 'detailed' && screeningHistory.length > 0 && (
                    <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                            توزیع امتیازات تطابق
                        </h4>
                        <div className="space-y-2">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-green-600 dark:text-green-400">بالا (۷۰٪+)</span>
                                    <span className="font-medium">{highMatch}</span>
                                </div>
                                <ProgressBar
                                    value={(highMatch / screeningHistory.length) * 100}
                                    max={100}
                                    className="h-1.5"
                                    color="green"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-yellow-600 dark:text-yellow-400">متوسط (۴۰-۶۹٪)</span>
                                    <span className="font-medium">{mediumMatch}</span>
                                </div>
                                <ProgressBar
                                    value={(mediumMatch / screeningHistory.length) * 100}
                                    max={100}
                                    className="h-1.5"
                                    color="yellow"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-red-600 dark:text-red-400">پایین (&lt;۴۰٪)</span>
                                    <span className="font-medium">{lowMatch}</span>
                                </div>
                                <ProgressBar
                                    value={(lowMatch / screeningHistory.length) * 100}
                                    max={100}
                                    className="h-1.5"
                                    color="red"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Screening Activity */}
                {pendingScreening.length > 0 && (
                    <div className="bg-yellow-50/50 dark:bg-yellow-900/10 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-800/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                    {pendingScreening.length} داوطلب در انتظار غربالگری
                                </span>
                            </div>
                            <Link
                                to="/ai/screening"
                                className="text-sm text-yellow-700 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 flex items-center gap-1"
                            >
                                مشاهده
                                <ChevronLeft className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <Link to="/ai/screening">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            مشاهده غربالگری
                        </Button>
                    </Link>
                    <Link to="/ai/assistant">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <Zap className="w-4 h-4" />
                            دستیار هوش مصنوعی
                        </Button>
                    </Link>
                    <Link to="/ai/analytics">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <TrendingUp className="w-4 h-4" />
                            تحلیل‌ها
                        </Button>
                    </Link>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
                    <span>آخرین بروزرسانی: {new Date().toLocaleString('fa-IR')}</span>
                    <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-green-500" />
                        سیستم فعال
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default AIOverview;