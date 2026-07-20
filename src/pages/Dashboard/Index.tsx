// frontend-company/src/pages/Dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Eye,
  ArrowLeft,
  ChevronLeft,
  Filter,
  UserCheck,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Plus,
} from 'lucide-react';
import { Button } from '../../components/common/UI/Button';
import { Badge } from '../../components/common/UI/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/UI/Card';
import { ProgressBar } from '../../components/common/UI/ProgressBar';
import { cn } from '../../lib/utils';
import {
  fetchDashboardStats,
  fetchAIScreeningData,
  selectDashboardStats,
  selectAIScreeningData,
  selectDashboardLoading
} from '../../store/slices/dashboard.slice';
import {
  fetchApplications,
  selectApplications,
  selectApplicationsLoading
} from '../../store/slices/applications.slice';
import { useAuth } from '../../hooks/useAuth';
import type { AppDispatch } from '../../store';

// ✅ Import all dashboard components
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { AIScreeningOverview } from '../../components/dashboard/AIScreeningOverview';
import { DashboardCharts } from '../../components/dashboard/DashboardCharts';
import { RecentActivity } from '../../components/dashboard/RecentActivity';

// Types for AI Insights from backend
interface AIInsight {
  id: string;
  type: 'auto_shortlisted' | 'needs_review' | 'suggestion' | 'trend';
  title: string;
  description: string;
  action?: string;
  actionLink?: string;
  icon: React.ElementType;
  color: string;
  iconBg: string;
}

// Loading Skeleton Components
const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="p-4 border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded mt-3 animate-pulse" />
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
      </Card>
    ))}
  </div>
);

const TableSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Real data from Redux store
  const stats = useSelector(selectDashboardStats);
  const screeningData = useSelector(selectAIScreeningData);
  const isLoading = useSelector(selectDashboardLoading);
  const applications = useSelector(selectApplications);
  const applicationsLoading = useSelector(selectApplicationsLoading);

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Fetch data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await Promise.all([
      dispatch(fetchDashboardStats()),
      dispatch(fetchAIScreeningData()),
      dispatch(fetchApplications())
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صبح بخیر';
    if (hour < 18) return 'عصر بخیر';
    return 'شب بخیر';
  };

  const formatDate = (date: string) => {
    if (!date) return 'نامشخص';
    return new Date(date).toLocaleDateString('fa-IR', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate AI Insights from real screening data
  useEffect(() => {
    if (screeningData) {
      const insights: AIInsight[] = [];

      // Auto-shortlisted candidates insight
      if (screeningData.totalCandidatesScreened > 0) {
        const highMatches = screeningData.screeningHistory?.filter(
          (job: any) => job.avgScore >= 70
        ) || [];

        if (highMatches.length > 0) {
          insights.push({
            id: '1',
            type: 'auto_shortlisted',
            title: `${screeningData.totalCandidatesScreened} داوطلب امروز غربال شدند`,
            description: `بر اساس تحلیل هوش مصنوعی، ${highMatches.length} داوطلب حداقل ۷۰٪ با نیازهای شغلی مطابقت دارند.`,
            action: 'مشاهده داوطلبان',
            actionLink: '/candidates',
            icon: Sparkles,
            color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
            iconBg: 'bg-green-100 dark:bg-green-900/30',
          });
        }
      }

      // High-potential candidates need review
      if (screeningData.pendingScreening && screeningData.pendingScreening.length > 0) {
        insights.push({
          id: '2',
          type: 'needs_review',
          title: `${screeningData.pendingScreening.length} داوطلب نیاز به بررسی دارند`,
          description: `این داوطلبان در صف بررسی هوش مصنوعی هستند. برای اطمینان از عدم از دست دادن استعدادهای بالقوه، آنها را به صورت دستی بررسی کنید.`,
          action: 'بررسی داوطلبان',
          actionLink: '/applications',
          icon: UserCheck,
          color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
        });
      }

      // Suggestion based on low performing jobs
      const lowPerformingJobs = screeningData.screeningHistory?.filter(
        (job: any) => job.avgScore < 50 && job.totalApplicants > 0
      ) || [];

      if (lowPerformingJobs.length > 0) {
        insights.push({
          id: '3',
          type: 'suggestion',
          title: `پیشنهاد: بازبینی شرح شغل`,
          description: `${lowPerformingJobs.length} آگهی شغلی نرخ تطابق پایینی دارند. تنظیم نیازمندی‌ها یا محدوده حقوقی را در نظر بگیرید.`,
          action: 'مشاهده مشاغل',
          actionLink: '/jobs',
          icon: Target,
          color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        });
      }

      setAiInsights(insights);
    }
  }, [screeningData]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'warning' | 'info' | 'success' | 'danger', label: string }> = {
      pending: { variant: 'warning', label: 'در انتظار' },
      reviewing: { variant: 'info', label: 'در حال بررسی' },
      shortlisted: { variant: 'success', label: 'انتخاب شده' },
      rejected: { variant: 'danger', label: 'رد شده' },
    };
    return config[status] || config.pending;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Convert applications to activity format for RecentActivity
  const convertApplicationsToActivities = (apps: any[]): any => {
    if (!apps || apps.length === 0) return [];

    return apps.map((app: any) => ({
      id: app._id,
      type: app.status === 'shortlisted' ? 'shortlist' :
        app.status === 'interviewing' ? 'interview' :
          app.status === 'hired' ? 'candidate' : 'application',
      title: `${app.applicantId?.username || 'داوطلب'} برای ${app.jobId?.title || 'موقعیت شغلی'} درخواست داد`,
      description: `${app.applicantId?.username || 'داوطلب'} - ${app.jobId?.title || 'بدون شغل'}`,
      timestamp: app.createdAt || app.appliedAt || new Date(),
      status: app.status === 'pending' ? 'pending' :
        app.status === 'shortlisted' ? 'completed' :
          app.status === 'interviewing' ? 'in-progress' :
            app.status === 'rejected' ? 'rejected' :
              app.status === 'hired' ? 'completed' : undefined,
      link: `/applications/${app._id}`,
      user: {
        name: app.applicantId?.username || 'داوطلب ناشناس'
      }
    }));
  };

  // Loading state
  if (isLoading && !stats) {
    return (
      <div className="space-y-6" dir="rtl">
        {/* Welcome Section Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-28 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        <StatsSkeleton />

        {/* AI Insights Skeleton */}
        <Card className="border-gray-200/50 dark:border-gray-800/50">
          <CardHeader>
            <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-64 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="border-gray-200/50 dark:border-gray-800/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-24 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TableSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Welcome Section - Improved */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              داشبورد
            </h1>
            <Badge variant="success" size="sm" className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              زنده
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {getGreeting()}، {user?.fullName || 'کاربر'}! در اینجا خلاصه فعالیت‌های استخدامی شما را مشاهده می‌کنید.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => navigate('/jobs/create')}
          >
            <Plus className="w-4 h-4" />
            ثبت آگهی شغلی
          </Button>
          <Button
            className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            size="sm"
            onClick={() => navigate('/ai/screening')}
          >
            <Sparkles className="w-4 h-4" />
            بینش هوش مصنوعی
          </Button>
        </div>
      </div>

      {/* ✅ DashboardStats */}
      {stats && (
        <DashboardStats
          stats={stats}
          showTrends={true}
          className="mt-2"
        />
      )}

      {/* ✅ AI Screening Overview */}
      {screeningData && (
        <AIScreeningOverview
          data={screeningData}
          className="mt-6"
          onRefresh={() => {
            dispatch(fetchAIScreeningData());
          }}
        />
      )}

      {/* ✅ Dashboard Charts */}
      <Card className="border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <CardHeader className="pb-3 bg-linear-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                نمای کلی تحلیلی
              </CardTitle>
              <CardDescription>
                روندهای استخدامی خود را دنبال کنید
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/jobs/analytics')}
            >
              <TrendingUp className="w-4 h-4" />
              گزارش کامل
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <DashboardCharts
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </CardContent>
      </Card>

      {/* AI Screening Insights - Improved */}
      {aiInsights.length > 0 && (
        <Card className="overflow-hidden border-gray-200/50 dark:border-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="p-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                بینش‌های هوش مصنوعی
              </CardTitle>
              <CardDescription>بینش‌های مبتنی بر هوش مصنوعی برای بهینه‌سازی فرآیند استخدام</CardDescription>
            </div>
            <Link to="/ai/screening">
              <Button variant="ghost" size="sm" className="gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                مشاهده همه
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.slice(0, 3).map((insight) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={insight.id}
                    className={cn(
                      "flex flex-col gap-3 p-4 rounded-xl border transition-all hover:shadow-md",
                      insight.color
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-lg shrink-0", insight.iconBg)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                    {insight.action && (
                      <Link to={insight.actionLink || '#'} className="mt-auto">
                        <Button size="sm" variant="ghost" className="px-0 gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                          {insight.action}
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ Recent Activity & Applications - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Table */}
        <div className="lg:col-span-2">
          <Card className="border-gray-200/50 dark:border-gray-800/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="w-5 h-5 text-gray-400" />
                  درخواست‌های اخیر
                </CardTitle>
                <CardDescription>آخرین درخواست‌های داوطلبان</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Filter className="w-4 h-4" />
                  فیلتر
                </Button>
                <Link to="/applications">
                  <Button variant="ghost" size="sm" className="gap-1 text-gray-600 dark:text-gray-400">
                    مشاهده همه
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {applicationsLoading && applications?.length === 0 ? (
                <TableSkeleton />
              ) : applications?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          داوطلب
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          موقعیت شغلی
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          وضعیت
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          امتیاز AI
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          تاریخ درخواست
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          عملیات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {applications.slice(0, 5).map((app: any) => {
                        const statusConfig = getStatusBadge(app.status);
                        return (
                          <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                  {app?.applicantId?.username?.charAt(0) || '?'}
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {app?.applicantId?.username || 'ناشناس'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                              {app?.jobId?.title || 'نامشخص'}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={statusConfig.variant} size="sm">
                                {statusConfig.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className={cn("text-sm font-semibold", getScoreColor(app.aiScore || 0))}>
                                  {app.aiScore || 0}%
                                </span>
                                <ProgressBar
                                  value={app.aiScore || 0}
                                  max={100}
                                  className="w-12 h-1.5"
                                  color={app.aiScore >= 70 ? 'green' : app.aiScore >= 40 ? 'yellow' : 'red'}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(app.createdAt)}
                            </td>
                            <td className="px-4 py-3 text-left">
                              <Link to={`/applications/${app._id}`}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye className="w-4 h-4 text-gray-400" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">هنوز درخواستی وجود ندارد</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">با ثبت اولین آگهی شغلی، دریافت درخواست‌ها را شروع کنید</p>
                  <Link to="/jobs/create">
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="w-4 h-4 ml-2" />
                      ثبت اولین آگهی شغلی
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ✅ Recent Activity Sidebar */}
        <div className="lg:col-span-1">
          <RecentActivity
            activities={convertApplicationsToActivities(applications)}
            limit={5}
          />
        </div>
      </div>

      {/* Quick Actions - Improved */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/jobs/create">
          <Card className="p-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-gray-200/50 dark:border-gray-800/50 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <Plus className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">ثبت آگهی شغلی</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ایجاد آگهی جدید</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/candidates">
          <Card className="p-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-gray-200/50 dark:border-gray-800/50 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">جستجوی داوطلبان</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">جستجو در بانک استعدادها</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/applications">
          <Card className="p-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-gray-200/50 dark:border-gray-800/50 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                <FileText className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">بررسی درخواست‌ها</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats?.pendingApplications || 0} در انتظار
                </p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/jobs/analytics">
          <Card className="p-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-gray-200/50 dark:border-gray-800/50 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">تحلیل‌ها</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">مشاهده گزارش‌ها</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;