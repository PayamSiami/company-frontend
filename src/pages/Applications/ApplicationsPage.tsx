// frontend-company/src/pages/Applications/Index.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { ApplicationList } from '../../components/applications/ApplicationList';
import { ApplicationFilters } from '../../components/applications/ApplicationFilters';
import { ApplicationStats } from '../../components/applications/ApplicationStats';
import { Button } from '../../components/common/UI/Button';
import { Badge } from '../../components/common/UI/Badge';
import { Card } from '../../components/common/UI/Card';
import { Tabs, TabsList, TabsTrigger } from '../../components/common/UI/Tabs';
import {
  Download,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Star,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Activity,
  Sparkles,
  Calendar,
  ChevronDown,
  Plus,
  XCircle as XCircleIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchApplications } from '../../store/slices/applications.slice';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '../../store/hooks';

type ApplicationStatus = 'all' | 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired' | 'interview_scheduled';

const ApplicationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { applications, isLoading } = useSelector((state: RootState) => state.applications);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'status' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<ApplicationStatus>('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleExport = () => {
    toast.success('درخواست‌ها با موفقیت خروجی گرفته شدند!');
  };

  const applicationsList = useMemo(() => {
    if (applications && Array.isArray(applications)) {
      return applications;
    }
    if (Array.isArray(applications)) {
      return applications;
    }
    return [];
  }, [applications]);

  const totalCount = useMemo(() => {
    return applicationsList.length;
  }, [applications, applicationsList]);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = applicationsList || [];

    // Status filter
    if (activeTab !== 'all') {
      const statusMap: Record<string, string> = {
        pending: 'PENDING',
        reviewing: 'REVIEWING',
        shortlisted: 'SHORTLISTED',
        rejected: 'REJECTED',
        hired: 'HIRED',
        interview_scheduled: 'INTERVIEW_SCHEDULED',
      };
      filtered = filtered.filter(app => app.status === statusMap[activeTab]);
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((app: any) =>
        app?.userId?.username.toLowerCase().includes(term) ||
        app?.jobId?.title?.toLowerCase().includes(term) ||
        app.candidateId?.toLowerCase().includes(term) ||
        app.status?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [applicationsList, activeTab, searchTerm, sortBy, sortOrder]);

  // ✅ Calculate counts safely
  const getCount = (status: string) => {
    return applicationsList?.filter(a => a.status === status).length || 0;
  };

  const tabs = [
    { value: 'all', label: 'همه', icon: FileText, count: totalCount },
    { value: 'pending', label: 'در انتظار', icon: Clock, count: getCount('PENDING') },
    { value: 'reviewing', label: 'در حال بررسی', icon: Users, count: getCount('REVIEWING') },
    { value: 'shortlisted', label: 'انتخاب شده', icon: Star, count: getCount('SHORTLISTED') },
    { value: 'rejected', label: 'رد شده', icon: XCircle, count: getCount('REJECTED') },
    { value: 'hired', label: 'استخدام شده', icon: CheckCircle, count: getCount('HIRED') },
  ];

  // ✅ Calculate AI insights safely
  const highMatchCount = applicationsList?.filter(a => a.aiScore && a.aiScore >= 70).length || 0;
  const mediumMatchCount = applicationsList?.filter(a => a.aiScore && a.aiScore >= 40 && a.aiScore < 70).length || 0;
  const lowMatchCount = applicationsList?.filter(a => a.aiScore && a.aiScore < 40).length || 0;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                درخواست‌ها
                <Badge variant="info" size="sm" className="mr-2">
                  <Activity className="w-3 h-3 ml-1" />
                  {totalCount} کل
                </Badge>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                مدیریت و بررسی درخواست‌های داوطلبان
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors",
              isSearchFocused ? "text-blue-500" : "text-gray-400"
            )} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="جستجوی درخواست‌ها..."
              className={cn(
                "pr-9 pl-4 py-2 text-sm border rounded-xl bg-white dark:bg-gray-900 focus:outline-none transition-all w-48 md:w-64 text-right",
                isSearchFocused
                  ? "border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-400/20"
                  : "border-gray-200 dark:border-gray-700"
              )}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedIds.length > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Badge variant="success" size="sm" className="px-3 py-1.5 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {selectedIds.length} انتخاب شده
              </Badge>
            </motion.div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "gap-1.5 transition-all",
              showFilters && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
            )}
          >
            <Filter className="w-4 h-4" />
            فیلترها
            {showFilters && <ChevronDown className="w-3 h-3" />}
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">خروجی</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            onClick={() => window.location.href = '/jobs/create'}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">ثبت آگهی</span>
          </Button>
        </div>
      </div>

      {/* AI Quick Insights Banner */}
      <div className="bg-linear-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">بینش‌های غربالگری هوش مصنوعی</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {highMatchCount} داوطلب با کیفیت بالا شناسایی شدند
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {highMatchCount} تطابق بالا
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {mediumMatchCount} تطابق متوسط
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {lowMatchCount} تطابق پایین
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <ApplicationStats />

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="p-4 border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
              <ApplicationFilters onClose={() => setShowFilters(false)} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Tabs */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ApplicationStatus)}
          className="w-full"
        >
          <TabsList className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <Badge variant="gray" size="sm" className="mr-0.5">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">مرتب‌سازی بر اساس تاریخ</option>
            <option value="score">مرتب‌سازی بر اساس امتیاز</option>
            <option value="status">مرتب‌سازی بر اساس وضعیت</option>
            <option value="name">مرتب‌سازی بر اساس نام</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="تغییر ترتیب مرتب‌سازی"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
          </button>

          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'grid'
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
              aria-label="نمایش شبکه‌ای"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'list'
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
              aria-label="نمایش لیستی"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          نمایش <span className="font-medium text-gray-900 dark:text-white">{filteredApplications.length}</span> درخواست
          {searchTerm && (
            <span className="mr-1">مطابق با "<span className="font-medium">{searchTerm}</span>"</span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="gray" size="sm" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {activeTab !== 'all' ? activeTab.replace('_', ' ') : 'همه'}
          </Badge>
          {filteredApplications.length > 0 && (
            <Badge variant="gray" size="sm" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {filteredApplications.length} کل
            </Badge>
          )}
        </div>
      </div>

      {/* Application List */}
      <ApplicationList
        applications={filteredApplications}
        loading={isLoading}
        onSelect={setSelectedIds}
        selectedIds={selectedIds}
      />

      {/* Empty State */}
      {filteredApplications.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">هیچ درخواستی یافت نشد</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-md mx-auto">
            {searchTerm || activeTab !== 'all'
              ? 'سعی کنید جستجو یا فیلترهای خود را تنظیم کنید تا آنچه را که به دنبال آن هستید پیدا کنید.'
              : 'برای دریافت درخواست از داوطلبان واجد شرایط، ثبت آگهی شغلی را شروع کنید.'}
          </p>
          {(searchTerm || activeTab !== 'all') && (
            <Button
              variant="outline"
              className="mt-4 gap-2"
              onClick={() => {
                setSearchTerm('');
                setActiveTab('all');
              }}
            >
              <XCircleIcon className="w-4 h-4" />
              پاک کردن فیلترها
            </Button>
          )}
          {!searchTerm && activeTab === 'all' && (
            <Button
              className="mt-4 gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.location.href = '/jobs/create'}
            >
              <Plus className="w-4 h-4" />
              ثبت اولین آگهی شغلی
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ApplicationsPage;