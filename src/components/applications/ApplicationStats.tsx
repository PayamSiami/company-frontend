// frontend-company/src/components/applications/ApplicationStats.tsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  TrendingUp,
  Award,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ProgressBar } from '../common/UI/ProgressBar';

interface StatCardProps {
  title: string;
  value: number | string;
  color: string;
  trend?: number;
  subtitle?: string;
  progress?: number;
  iconBg?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  trend,
  subtitle,
  progress,
}) => (
  <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {subtitle}
          </p>
        )}
        {trend !== undefined && (
          <div className={cn(
            "inline-flex items-center gap-1 text-xs font-medium mt-1.5 px-2 py-0.5 rounded-full",
            trend >= 0
              ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
              : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
          )}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            <span className="text-gray-400 dark:text-gray-500 font-normal">نسبت به ماه قبل</span>
          </div>
        )}
        {progress !== undefined && (
          <div className="mt-2">
            <ProgressBar
              value={progress}
              max={100}
              className="h-1.5"
              color={color as any}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

export const ApplicationStats: React.FC = () => {
  const { applications } = useSelector((state: RootState) => state.applications);

  const stats = useMemo(() => {
    const total = applications?.length;
    const pending = applications?.filter(a => a.status === 'pending').length;
    const reviewing = applications?.filter(a => a.status === 'reviewing').length;
    const shortlisted = applications?.filter(a => a.status === 'shortlisted').length;
    const rejected = applications?.filter(a => a.status === 'rejected').length;
    const hired = applications?.filter(a => a.status === 'hired').length;
    const interviewScheduled = applications?.filter(a => a?.status === 'interviewing').length;

    const screenedApps = applications?.filter(a => a.aiScore !== null && a.aiScore !== undefined);
    const avgScore = screenedApps?.length > 0
      ? screenedApps?.reduce((sum, a) => sum + (a.aiScore || 0), 0) / screenedApps?.length
      : 0;

    const highScore = screenedApps?.filter(a => (a.aiScore || 0) >= 70).length;
    const mediumScore = screenedApps?.filter(a => (a.aiScore || 0) >= 40 && (a.aiScore || 0) < 70).length;
    const lowScore = screenedApps?.filter(a => (a.aiScore || 0) < 40).length;

    const conversionRate = total > 0 ? (hired / total) * 100 : 0;
    const shortlistRate = total > 0 ? (shortlisted / total) * 100 : 0;
    const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;
    const screeningCoverage = total > 0 ? (screenedApps.length / total) * 100 : 0;

    return {
      total,
      pending,
      reviewing,
      shortlisted,
      rejected,
      hired,
      interviewScheduled,
      avgScore,
      highScore,
      mediumScore,
      lowScore,
      conversionRate,
      shortlistRate,
      rejectionRate,
      screeningCoverage,
      screenedCount: screenedApps?.length,
      unscreenedCount: total - screenedApps?.length,
    };
  }, [applications]);

  const mainCards = [
    {
      title: 'کل درخواست‌ها',
      value: stats?.total,
      color: 'bg-blue-500',
      trend: 12,
      subtitle: `${stats?.pending} در انتظار بررسی`
    },
    {
      title: 'پوشش غربالگری',
      value: `${Math.round(stats?.screeningCoverage)}%`,
      color: 'bg-indigo-500',
      trend: 8,
      progress: stats?.screeningCoverage,
      subtitle: `${stats?.screenedCount} از ${stats?.total} غربال شده`
    },
    {
      title: 'انتخاب شده‌ها',
      value: stats?.shortlisted,
      color: 'bg-green-500',
      trend: 5,
      subtitle: `${Math.round(stats?.shortlistRate)}% از کل`
    },
    {
      title: 'میانگین امتیاز هوش مصنوعی',
      value: `${Math.round(stats?.avgScore)}%`,
      color: 'bg-purple-500',
      trend: 3,
      progress: stats?.avgScore,
      subtitle: `${stats?.highScore} بالا، ${stats?.mediumScore} متوسط، ${stats?.lowScore} پایین`
    }
  ];

  const statusCards = [
    {
      title: 'در انتظار بررسی',
      value: stats?.pending,
      color: 'bg-yellow-500',
    },
    {
      title: 'در حال بررسی',
      value: stats?.reviewing,
      color: 'bg-blue-400',
    },
    {
      title: 'مصاحبه برنامه‌ریزی شده',
      value: stats?.interviewScheduled,
      color: 'bg-purple-500',
    },
    {
      title: 'رد شده‌ها',
      value: stats?.rejected,
      color: 'bg-red-500',
      trend: -2,
    },
    {
      title: 'استخدام شده‌ها',
      value: stats?.hired,
      color: 'bg-emerald-500',
      trend: 10,
      subtitle: `${Math.round(stats?.conversionRate)}% نرخ تبدیل`
    },
  ];

  // Calculate top performing job (mock)
  const topPerformingJob: any = applications.length > 0
    ? applications.reduce((a, b) => (a.aiScore || 0) > (b.aiScore || 0) ? a : b)
    : null;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statusCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI Score Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              توزیع امتیازات هوش مصنوعی
            </h4>
          </div>
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-600 dark:text-green-400">بالا (۷۰٪+)</span>
                <span className="font-medium">{stats.highScore}</span>
              </div>
              <ProgressBar
                value={(stats.highScore / stats.screenedCount) * 100 || 0}
                max={100}
                className="h-1.5"
                color="green"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-yellow-600 dark:text-yellow-400">متوسط (۴۰-۶۹٪)</span>
                <span className="font-medium">{stats.mediumScore}</span>
              </div>
              <ProgressBar
                value={(stats.mediumScore / stats.screenedCount) * 100 || 0}
                max={100}
                className="h-1.5"
                color="yellow"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-600 dark:text-red-400">پایین (&lt;۴۰٪)</span>
                <span className="font-medium">{stats.lowScore}</span>
              </div>
              <ProgressBar
                value={(stats.lowScore / stats.screenedCount) * 100 || 0}
                max={100}
                className="h-1.5"
                color="red"
              />
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              قیف تبدیل
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">درخواست‌ها</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">→ انتخاب شده</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {stats.shortlisted} ({Math.round(stats.shortlistRate)}%)
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">→ مصاحبه شده</span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                {stats.interviewScheduled} ({Math.round((stats.interviewScheduled / stats.total) * 100)}%)
              </span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-100 dark:border-gray-800 pt-1.5">
              <span className="text-gray-600 dark:text-gray-400">→ استخدام شده</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {stats.hired} ({Math.round(stats.conversionRate)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Top Candidate */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              برترین داوطلب
            </h4>
          </div>
          {topPerformingJob ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-medium shrink-0">
                {topPerformingJob?.userId?.username?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {topPerformingJob?.userId?.username || 'ناشناس'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {topPerformingJob?.jobIdId?.title} • {topPerformingJob.aiScore || 0}% تطابق
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium">برتر</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">هنوز داوطلبی امتیازدهی نشده است</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStats;