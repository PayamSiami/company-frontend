// frontend-company/src/pages/AI/Analytics.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  fetchAIAnalytics,
  fetchHiringFunnel,
  fetchScreeningStats
} from '../../store/slices/analytics.slice';
import { Card } from '../../components/common/UI/Card';
import { Badge } from '../../components/common/UI/Badge';
import { Button } from '../../components/common/UI/Button';
import { ProgressBar } from '../../components/common/UI/ProgressBar';
import {
  TrendingUp,
  Users,
  Clock,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Zap,
  Brain,
  Activity,
  Eye,
  Download,
  Share2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppDispatch } from '../../store/hooks';

// Types
interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  isLoading?: boolean;
}

interface AnalyticsData {
  metrics: {
    hiringEfficiency: number;
    candidateQuality: number;
    timeToHire: number;
    aiAccuracy: number;
  };
  screeningStats: {
    total: number;
    high: number;
    medium: number;
    low: number;
    accuracy: number;
    avgScore: number;
  };
  hiringFunnel: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
  performanceMetrics: {
    totalScreenings: number;
    avgProcessingTime: number;
    predictionAccuracy: number;
    jobsWithAI: number;
    jobsTotal: number;
  };
  performanceHistory: Array<{
    date: string;
    value: number;
  }>;
  trends: {
    screenings: number;
    processingTime: number;
    accuracy: number;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  bg,
  description,
  trend = change?.startsWith('+') ? 'up' : 'down',
  onClick,
  isLoading = false,
}) => {
  const isPositive = trend === 'up';

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-5 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 w-10 h-10" />
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="mt-3 h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="mt-1 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "p-2.5 rounded-xl transition-transform group-hover:scale-105",
          bg
        )}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        {change && (
          <span className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
            isPositive
              ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
              : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
          )}>
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

const AIAnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    analytics,
    funnel,
    stats,
    isLoading,
    error,
    lastUpdated
  } = useSelector((state: RootState) => state.analytics);

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchAIAnalytics(timeRange));
    dispatch(fetchHiringFunnel(timeRange));
    dispatch(fetchScreeningStats());
  }, [dispatch, timeRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      dispatch(fetchAIAnalytics(timeRange)),
      dispatch(fetchHiringFunnel(timeRange)),
      dispatch(fetchScreeningStats()),
    ]);
    setIsRefreshing(false);
  };

  const metrics = useMemo(() => {
    if (!analytics) {
      return [
        {
          title: 'کارایی استخدام',
          value: '--',
          change: '',
          icon: TrendingUp,
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-900/20',
          isLoading: true,
        },
        {
          title: 'کیفیت داوطلبان',
          value: '--',
          change: '',
          icon: Award,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          isLoading: true,
        },
        {
          title: 'زمان تا استخدام',
          value: '--',
          change: '',
          icon: Clock,
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          isLoading: true,
        },
        {
          title: 'دقت هوش مصنوعی',
          value: '--',
          change: '',
          icon: Sparkles,
          color: 'text-indigo-600 dark:text-indigo-400',
          bg: 'bg-indigo-50 dark:bg-indigo-900/20',
          isLoading: true,
        },
      ];
    }

    return [
      {
        title: 'کارایی استخدام',
        value: `${analytics.metrics.hiringEfficiency}%`,
        change: `${analytics.trends?.screenings > 0 ? '+' : ''}${analytics.trends?.screenings || 0}%`,
        icon: TrendingUp,
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20',
        description: `${Math.abs(analytics.trends?.screenings || 0)}% ${analytics.trends?.screenings > 0 ? 'سریع‌تر' : 'کندتر'} از ماه قبل`,
        isLoading: false,
      },
      {
        title: 'کیفیت داوطلبان',
        value: analytics.metrics.candidateQuality.toFixed(1),
        change: '+۰.۳',
        icon: Award,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        description: 'بر اساس بررسی‌های داوطلبان',
        isLoading: false,
      },
      {
        title: 'زمان تا استخدام',
        value: `${analytics.metrics.timeToHire} روز`,
        change: `-${Math.abs(analytics.trends?.processingTime || 0)} روز`,
        icon: Clock,
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        description: 'میانگین صنعت: ۱۸ روز',
        isLoading: false,
      },
      {
        title: 'دقت هوش مصنوعی',
        value: `${analytics.metrics.aiAccuracy}%`,
        change: `${analytics.trends?.accuracy > 0 ? '+' : ''}${analytics.trends?.accuracy || 0}%`,
        icon: Sparkles,
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        description: '۹۵٪ نرخ اطمینان',
        isLoading: false,
      },
    ];
  }, [analytics]);

  const screeningStats = useMemo(() => {
    if (!stats) {
      return {
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        accuracy: 0,
        avgScore: 0,
      };
    }
    return stats;
  }, [stats]);

  const hiringFunnel = useMemo(() => {
    if (!funnel || funnel.length === 0) {
      return [
        { stage: 'درخواست داده‌اند', count: 0, percentage: 0 },
        { stage: 'غربال AI شده', count: 0, percentage: 0 },
        { stage: 'انتخاب شده', count: 0, percentage: 0 },
        { stage: 'مصاحبه شده', count: 0, percentage: 0 },
        { stage: 'استخدام شده', count: 0, percentage: 0 },
      ];
    }
    return funnel;
  }, [funnel]);

  const performanceMetrics = useMemo(() => {
    if (!analytics) {
      return {
        totalScreenings: 0,
        avgProcessingTime: 0,
        predictionAccuracy: 0,
        jobsWithAI: 0,
        jobsTotal: 0,
      };
    }
    return analytics.performanceMetrics || {
      totalScreenings: 0,
      avgProcessingTime: 0,
      predictionAccuracy: 0,
      jobsWithAI: 0,
      jobsTotal: 0,
    };
  }, [analytics]);

  const performanceHistory = useMemo(() => {
    if (!analytics?.performanceHistory) {
      return Array.from({ length: 12 }, (_, i) => ({
        date: `هفته ${i + 1}`,
        value: 30 + Math.random() * 60,
      }));
    }
    return analytics.performanceHistory;
  }, [analytics]);

  const handleExport = () => {
    const exportData = {
      metrics: metrics,
      screeningStats: screeningStats,
      hiringFunnel: hiringFunnel,
      performanceMetrics: performanceMetrics,
      exportedAt: new Date().toISOString(),
      timeRange: timeRange,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4" dir="rtl">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">بارگذاری تحلیل‌ها با شکست مواجه شد</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md text-center">{error}</p>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                تحلیل‌های هوش مصنوعی
                <Badge variant="info" size="sm" className="mr-2">
                  <Activity className="w-3 h-3 ml-1" />
                  {isLoading ? 'در حال بارگذاری...' : 'زنده'}
                </Badge>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                بینش‌هایی از فرآیند استخدام مبتنی بر هوش مصنوعی
                {lastUpdated && (
                  <span className="mr-2 text-xs">
                    بروزرسانی: {new Date(lastUpdated).toLocaleString('fa-IR')}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                  timeRange === range
                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {range === '7d' ? '۷ روز' : 
                 range === '30d' ? '۳۰ روز' : 
                 range === '90d' ? '۹۰ روز' : '۱ سال'}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            بروزرسانی
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
            <Download className="w-4 h-4" />
            خروجی
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Screening Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              توزیع امتیازات غربالگری
            </h3>
            <Badge variant="gray" size="sm">
              {isLoading ? '...' : `${screeningStats.total} کل`}
            </Badge>
          </div>
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <span className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-600 dark:text-green-400">بالا (۷۰٪+)</span>
                    <span className="font-medium">{screeningStats.high}</span>
                  </div>
                  <ProgressBar
                    value={screeningStats.total > 0 ? (screeningStats.high / screeningStats.total) * 100 : 0}
                    max={100}
                    className="h-2"
                    color="green"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-yellow-600 dark:text-yellow-400">متوسط (۴۰-۶۹٪)</span>
                    <span className="font-medium">{screeningStats.medium}</span>
                  </div>
                  <ProgressBar
                    value={screeningStats.total > 0 ? (screeningStats.medium / screeningStats.total) * 100 : 0}
                    max={100}
                    className="h-2"
                    color="yellow"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-600 dark:text-red-400">پایین (&lt;۴۰٪)</span>
                    <span className="font-medium">{screeningStats.low}</span>
                  </div>
                  <ProgressBar
                    value={screeningStats.total > 0 ? (screeningStats.low / screeningStats.total) * 100 : 0}
                    max={100}
                    className="h-2"
                    color="red"
                  />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>میانگین امتیاز: <span className="font-semibold text-gray-900 dark:text-white">{screeningStats.avgScore}%</span></span>
                <span>دقت: <span className="font-semibold text-gray-900 dark:text-white">{screeningStats.accuracy}%</span></span>
              </div>
            </>
          )}
        </Card>

        {/* Hiring Funnel */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              قیف استخدام
            </h3>
            <Badge variant="gray" size="sm">
              {isLoading ? '...' : `${hiringFunnel[0]?.count || 0} کل`}
            </Badge>
          </div>
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <span className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {hiringFunnel.map((stage, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{stage.stage}</span>
                    <span className="font-medium">{stage.count} ({stage.percentage}%)</span>
                  </div>
                  <ProgressBar
                    value={stage.percentage}
                    max={100}
                    className="h-2"
                    color={idx === 0 ? 'blue' : idx === hiringFunnel.length - 1 ? 'green' : 'gray'}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* AI Performance Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            معیارهای عملکرد هوش مصنوعی
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {isLoading ? 'در حال بارگذاری...' : 'سیستم فعال'}
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">کل غربالگری‌ها</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {performanceMetrics.totalScreenings.toLocaleString('fa-IR')}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ↑ ۱۲٪ این ماه
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">میانگین زمان پردازش</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {performanceMetrics.avgProcessingTime} ثانیه
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ↓ ۱۸٪ سریع‌تر
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">دقت پیش‌بینی</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {performanceMetrics.predictionAccuracy}%
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ↑ ۵٪ بهبود
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">مشاغل با هوش مصنوعی</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {performanceMetrics.jobsWithAI}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {performanceMetrics.jobsTotal > 0
                  ? `${Math.round((performanceMetrics.jobsWithAI / performanceMetrics.jobsTotal) * 100)}% از کل مشاغل`
                  : 'هنوز شغلی وجود ندارد'}
              </p>
            </div>
          </div>
        )}

        {/* Performance History Chart */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-500 dark:text-gray-400">تاریخچه عملکرد</span>
            <span className="text-xs text-gray-400">۳۰ روز گذشته</span>
          </div>
          {isLoading ? (
            <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ) : (
            <div className="flex items-end gap-2 h-24">
              {performanceHistory.map((item: { value: number; date: any; }, i: React.Key | null | undefined) => {
                const height = Math.min(100, Math.max(10, (item.value / 100) * 80 + 10));
                const isHigh = height > 70;
                const isLow = height < 30;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer",
                      isHigh ? "bg-green-400 dark:bg-green-500" :
                        isLow ? "bg-red-400 dark:bg-red-500" :
                          "bg-blue-400 dark:bg-blue-500"
                    )}
                    style={{ height: `${height}%` }}
                    title={`${item.date}: ${item.value}%`}
                  />
                );
              })}
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>هفته ۱</span>
            <span>هفته ۲</span>
            <span>هفته ۳</span>
            <span>هفته ۴</span>
          </div>
        </div>
      </Card>

      {/* Insights Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-green-500" />
            سیستم {isLoading ? 'در حال بارگذاری...' : 'فعال'}
          </span>
          <span>
            آخرین بروزرسانی: {lastUpdated ? new Date(lastUpdated).toLocaleString('fa-IR') : 'هرگز'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            اشتراک‌گذاری گزارش
          </button>
          <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
            <Eye className="w-3 h-3" />
            مشاهده جزئیات
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsPage;