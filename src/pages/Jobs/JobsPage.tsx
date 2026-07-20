// frontend-company/src/pages/Jobs/index.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { JobList } from '../../components/jobs/JobList';
import { JobFilters } from '../../components/jobs/JobFilters';
import { CreateJobDialog } from '../../components/jobs/CreateJobDialog';
import { Button } from '../../components/common/UI/Button';
import { Badge } from '../../components/common/UI/Badge';
import { Card } from '../../components/common/UI/Card';
import { Tabs, TabsList, TabsTrigger } from '../../components/common/UI/Tabs';
import {
  Plus,
  Filter,
  Search,
  LayoutGrid,
  List,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  ArrowUpDown,
  Activity,
  Download,
  Award
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchJobs } from '../../store/slices/jobs.slice';
import { toast } from 'sonner';
import { useAppDispatch } from '../../store/hooks';

type ViewMode = 'grid' | 'list';
type JobStatus = 'all' | 'active' | 'pending' | 'closed' | 'draft' | 'expired' | 'filled';

const JobsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, isLoading } = useSelector((state: RootState) => state.jobs);
  const [view, setView] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'applications' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<JobStatus>('all');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchJobs({ isActive: true }));
  }, [dispatch]);

  const handleExport = () => {
    toast.success('مشاغل با موفقیت خروجی گرفته شدند!');
  };

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Status filter
    if (activeTab !== 'all') {
      const statusMap: Record<string, string> = {
        active: 'OPEN',
        pending: 'DRAFT',
        closed: 'CLOSED',
        expired: 'EXPIRED',
        filled: 'FILLED',
      };
      filtered = filtered.filter(job => job.status === statusMap[activeTab]);
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [jobs, activeTab, searchTerm, sortBy, sortOrder]);

  const stats = useMemo(() => ({
    total: jobs?.length,
    active: jobs?.filter(j => j.status === 'OPEN').length,
    pending: jobs?.filter(j => j.status === 'DRAFT').length,
    closed: jobs?.filter(j => j.status === 'CLOSED').length,
    expired: jobs?.filter(j => j.status === 'EXPIRED').length,
    filled: jobs?.filter(j => j.status === 'FILLED').length,
    totalApplications: jobs?.reduce((sum, j) => sum + (j.applicationCount || 0), 0),
  }), [jobs]);

  const tabs = [
    { value: 'all', label: 'همه مشاغل', icon: Briefcase, count: stats.total },
    { value: 'active', label: 'فعال', icon: CheckCircle, count: stats.active },
    { value: 'pending', label: 'در انتظار', icon: Clock, count: stats.pending },
    { value: 'closed', label: 'بسته شده', icon: XCircle, count: stats.closed },
    { value: 'expired', label: 'منقضی شده', icon: AlertCircle, count: stats.expired },
    { value: 'filled', label: 'تکمیل شده', icon: Award, count: stats.filled },
  ];

  const statCards = [
    { label: 'کل مشاغل', value: stats.total, icon: Briefcase, color: 'blue' },
    { label: 'فعال', value: stats.active, icon: CheckCircle, color: 'green' },
    { label: 'در انتظار', value: stats.pending, icon: Clock, color: 'yellow' },
    { label: 'بسته شده', value: stats.closed, icon: XCircle, color: 'red' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                مشاغل
                <Badge variant="info" size="sm" className="mr-2">
                  <Activity className="w-3 h-3 ml-1" />
                  {stats.total} کل
                </Badge>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                مدیریت آگهی‌های شغلی و پیگیری درخواست‌ها
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی مشاغل..."
              className="pr-9 pl-4 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-40 md:w-56 text-right"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="gap-1.5"
          >
            {view === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            {view === 'grid' ? 'لیست' : 'شبکه'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("gap-1.5", showFilters && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800")}
          >
            <Filter className="w-4 h-4" />
            فیلترها
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">خروجی</span>
          </Button>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">ثبت آگهی جدید</span>
            <span className="sm:hidden">جدید</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={cn(
                "p-3 rounded-xl",
                `bg-${stat.color}-50 dark:bg-${stat.color}-900/20`
              )}>
                <stat.icon className={cn(
                  "w-5 h-5",
                  `text-${stat.color}-600 dark:text-${stat.color}-400`
                )} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
          <JobFilters onClose={() => setShowFilters(false)} />
        </Card>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Tabs */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as JobStatus)}
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
            <option value="title">مرتب‌سازی بر اساس عنوان</option>
            <option value="applications">مرتب‌سازی بر اساس درخواست‌ها</option>
            <option value="status">مرتب‌سازی بر اساس وضعیت</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          نمایش <span className="font-medium text-gray-900 dark:text-white">{filteredJobs?.length}</span> شغل
          {searchTerm && (
            <span className="mr-1">مطابق با "<span className="font-medium">{searchTerm}</span>"</span>
          )}
        </span>
        <span className="flex items-center gap-2">
          <Badge variant="gray" size="sm">
            {activeTab !== 'all' ? activeTab : 'همه'} نمایش
          </Badge>
          {stats.totalApplications > 0 && (
            <Badge variant="gray" size="sm" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {stats.totalApplications} کل درخواست‌ها
            </Badge>
          )}
        </span>
      </div>

      {/* Job List */}
      <JobList
        jobs={filteredJobs}
        view={view}
        loading={isLoading}
        onSelect={setSelectedJobs}
        selectedIds={selectedJobs}
      />

      {/* Empty State */}
      {filteredJobs?.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Briefcase className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">هیچ شغلی یافت نشد</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {searchTerm || activeTab !== 'all'
              ? 'سعی کنید جستجو یا فیلترهای خود را تنظیم کنید'
              : 'برای جذب داوطلبان، ثبت آگهی شغلی را شروع کنید'}
          </p>
          {(searchTerm || activeTab !== 'all') && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setActiveTab('all');
              }}
            >
              پاک کردن فیلترها
            </Button>
          )}
          {!searchTerm && activeTab === 'all' && (
            <Button
              className="mt-4 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4" />
              ثبت اولین آگهی شغلی
            </Button>
          )}
        </div>
      )}

      {/* Create Job Dialog */}
      <CreateJobDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default JobsPage;