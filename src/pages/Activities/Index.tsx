import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Activity,
    Clock,
    Users,
    Briefcase,
    FileText,
    Star,
    Calendar,
    Sparkles,
    Eye,
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    X,
    RefreshCw,
    Layers,
    Zap,
    ArrowLeft,
    ChevronUp,
} from 'lucide-react';
import { Card, CardContent } from '../../components/common/UI/Card';
import { Badge } from '../../components/common/UI/Badge';
import { Button } from '../../components/common/UI/Button';
import { Input } from '../../components/common/UI/Input';
import { cn } from '../../lib/utils';
import {
    fetchActivity,
    selectActivity,
    selectActivityLoading,
    selectActivityPagination,
} from '../../store/slices/activity.slice';
import type { AppDispatch } from '../../store';

// Types
interface ActivityItem {
    id: string;
    type: 'generation' | 'job' | 'application' | 'shortlist' | 'interview' | 'candidate' | 'ai';
    title: string;
    description?: string;
    score: number | null;
    timestamp: string;
    status: 'pending' | 'completed' | 'in-progress' | 'rejected';
    time: string;
    link?: string;
    jobTitle?: string;
    metadata?: {
        jobId?: string;
        isActive?: boolean;
    };
}

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

// Constants
const ACTIVITY_TYPES = [
    { value: 'all', label: 'همه فعالیت‌ها', icon: Layers },
    { value: 'generation', label: 'تولید محتوا', icon: Sparkles },
    { value: 'job', label: 'موقعیت شغلی', icon: Briefcase },
    { value: 'application', label: 'درخواست', icon: FileText },
    { value: 'shortlist', label: 'لیست کوتاه', icon: Star },
    { value: 'interview', label: 'مصاحبه', icon: Calendar },
    { value: 'candidate', label: 'کاندیدا', icon: Users },
    { value: 'ai', label: 'دستیار هوش مصنوعی', icon: Zap },
];

const STATUS_FILTERS = [
    { value: 'all', label: 'همه وضعیت‌ها' },
    { value: 'completed', label: 'تکمیل شده' },
    { value: 'pending', label: 'در انتظار' },
    { value: 'in-progress', label: 'در حال انجام' },
    { value: 'rejected', label: 'رد شده' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Helper Functions
const getActivityIcon = (type: ActivityItem['type']) => {
    const icons = {
        generation: Sparkles,
        job: Briefcase,
        application: FileText,
        shortlist: Star,
        interview: Calendar,
        candidate: Users,
        ai: Sparkles,
    };
    return icons[type] || Activity;
};

const getActivityColor = (type: ActivityItem['type']) => {
    const colors = {
        generation: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
        job: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        application: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        shortlist: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
        interview: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        candidate: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
        ai: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    };
    return colors[type] || 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
};

const getStatusBadge = (status?: ActivityItem['status']) => {
    if (!status) return null;
    const variants = {
        pending: { variant: 'warning' as const, label: 'در انتظار' },
        completed: { variant: 'success' as const, label: 'تکمیل شده' },
        'in-progress': { variant: 'info' as const, label: 'در حال انجام' },
        rejected: { variant: 'danger' as const, label: 'رد شده' },
    };
    const config = variants[status];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
};

const formatActivityDescription = (activity: ActivityItem): string => {
    if (activity.description) return activity.description;

    if (activity.type === 'generation') {
        return `تولید توضیحات شغلی برای "${activity.jobTitle || 'موقعیت'}"`;
    }
    if (activity.type === 'job') {
        return `موقعیت "${activity.jobTitle || 'نامشخص'}" منتشر شد`;
    }
    return '';
};

const getActivityTypeLabel = (type: ActivityItem['type']) => {
    const labels = {
        generation: 'تولید محتوا با هوش مصنوعی',
        job: 'موقعیت شغلی',
        application: 'درخواست',
        shortlist: 'لیست کوتاه',
        interview: 'مصاحبه',
        candidate: 'کاندیدا',
        ai: 'دستیار هوش مصنوعی',
    };
    return labels[type] || type;
};

// Components
const ActivityCard: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
    const Icon = getActivityIcon(activity.type);
    const colorClass = getActivityColor(activity.type);
    const description = formatActivityDescription(activity);

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all hover:border-gray-300 dark:hover:border-gray-700 group">
            <div className={cn("p-2.5 rounded-lg shrink-0", colorClass)}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {activity.title}
                            </h4>
                            {activity.jobTitle && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                    {activity.jobTitle}
                                </span>
                            )}
                            {getStatusBadge(activity.status)}
                        </div>
                        {description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {description}
                            </p>
                        )}
                        {activity.score !== null && (
                            <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant="info" size="sm">
                                    امتیاز: {activity.score}%
                                </Badge>
                            </div>
                        )}
                        {activity.metadata?.isActive !== undefined && (
                            <Badge
                                variant={activity.metadata.isActive ? 'success' : 'secondary'}
                                size="sm"
                                className="mt-1.5"
                            >
                                {activity.metadata.isActive ? 'فعال' : 'غیرفعال'}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.time}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        {getActivityTypeLabel(activity.type)}
                    </span>
                    {activity.link && (
                        <Link
                            to={activity.link}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            مشاهده جزئیات
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

// Skeleton Loader
const ActivitySkeleton: React.FC = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 animate-pulse">
                <div className="w-11 h-11 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="w-64 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="flex gap-3">
                        <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Empty State
const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            هیچ فعالیتی یافت نشد
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            فعالیتی با فیلترهای انتخاب شده وجود ندارد. می‌توانید فیلترها را تغییر دهید یا دوباره تلاش کنید.
        </p>
        <Button
            variant="outline"
            className="mt-4 gap-2"
            onClick={onReset}
        >
            <RefreshCw className="w-4 h-4" />
            بازنشانی فیلترها
        </Button>
    </div>
);

// Pagination Component
const Pagination: React.FC<{
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}> = ({ pagination, onPageChange, onLimitChange }) => {
    const { page, pages, total, limit } = pagination;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pages) {
            onPageChange(newPage);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>
                    نمایش {((page - 1) * limit) + 1} تا {Math.min(page * limit, total)} از {total} نتیجه
                </span>
                <select
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {PAGE_SIZE_OPTIONS.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="gap-1"
                >
                    <ChevronRight className="w-4 h-4" />
                    قبلی
                </Button>

                <div className="flex items-center gap-1 mx-2">
                    {[...Array(Math.min(5, pages))].map((_, i) => {
                        let pageNumber: number;
                        if (pages <= 5) {
                            pageNumber = i + 1;
                        } else if (page <= 3) {
                            pageNumber = i + 1;
                        } else if (page >= pages - 2) {
                            pageNumber = pages - 4 + i;
                        } else {
                            pageNumber = page - 2 + i;
                        }

                        if (pageNumber < 1 || pageNumber > pages) return null;

                        return (
                            <Button
                                key={pageNumber}
                                variant={pageNumber === page ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(pageNumber)}
                                className={cn(
                                    "min-w-8",
                                    pageNumber === page && "bg-blue-600 hover:bg-blue-700"
                                )}
                            >
                                {pageNumber}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= pages}
                    className="gap-1"
                >
                    بعدی
                    <ChevronLeft className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

// Filter Bar Component
const FilterBar: React.FC<{
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedType: string;
    setSelectedType: (type: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    onReset: () => void;
    totalCount: number;
}> = ({
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
}) => {
        const [isFilterOpen, setIsFilterOpen] = useState(false);

        return (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="جستجو در فعالیت‌ها..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 w-full"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            فیلترها
                            {(selectedType !== 'all' || selectedStatus !== 'all') && (
                                <Badge variant="info" size="sm" className="ml-0">
                                    {(selectedType !== 'all' ? 1 : 0) + (selectedStatus !== 'all' ? 1 : 0)}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>

                {isFilterOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                                نوع فعالیت
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {ACTIVITY_TYPES.map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => setSelectedType(value)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                                            selectedType === value
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/50"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                                وضعیت
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {STATUS_FILTERS.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => setSelectedStatus(value)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                            selectedStatus === value
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/50"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

// Main Component
const ActivityPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get data from Redux store
    const activities = useSelector(selectActivity);
    const loading = useSelector(selectActivityLoading);
    const pagination = useSelector(selectActivityPagination);

    // Local state
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [pageLimit, setPageLimit] = useState(Number(searchParams.get('limit')) || 20);

    // Fetch activities when filters change
    useEffect(() => {
        dispatch(fetchActivity({
            page: currentPage,
            limit: pageLimit,
        }));

        // Update URL params
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedType !== 'all') params.type = selectedType;
        if (selectedStatus !== 'all') params.status = selectedStatus;
        if (currentPage > 1) params.page = String(currentPage);
        if (pageLimit !== 20) params.limit = String(pageLimit);
        setSearchParams(params);
    }, [dispatch, currentPage, pageLimit, searchQuery, selectedType, selectedStatus, setSearchParams]);

    // Handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLimitChange = (limit: number) => {
        setPageLimit(limit);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedType('all');
        setSelectedStatus('all');
        setCurrentPage(1);
    };

    // Filter activities locally for search (additional filtering)
    const filteredActivities = useMemo(() => {
        if (!activities) return [];
        let filtered = [...activities];

        // Apply search filter locally (for additional filtering beyond API)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((activity: ActivityItem) =>
                activity.title.toLowerCase().includes(query) ||
                (activity.description && activity.description.toLowerCase().includes(query)) ||
                (activity.jobTitle && activity.jobTitle.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [activities, searchQuery]);

    // Get total count from pagination or filtered activities
    const totalCount = pagination?.total || filteredActivities.length;

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="gap-1.5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            بازگشت
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-6 h-6 text-blue-500" />
                            همه فعالیت‌ها
                        </h1>
                        <Badge variant="secondary" size="sm">
                            {totalCount} فعالیت
                        </Badge>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 mr-11">
                        مشاهده و مدیریت تمام فعالیت‌های انجام شده در سیستم
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                onReset={handleResetFilters}
                totalCount={totalCount}
            />

            {/* Activities List */}
            <Card>
                <CardContent className="p-4 sm:p-6">
                    {loading ? (
                        <ActivitySkeleton />
                    ) : filteredActivities.length === 0 ? (
                        <EmptyState onReset={handleResetFilters} />
                    ) : (
                        <div className="space-y-3">
                            {filteredActivities.map((activity: ActivityItem) => (
                                <ActivityCard key={activity.id} activity={activity} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {!loading && pagination && pagination.total > 0 && (
                <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            )}

            {/* Back to Top */}
            {filteredActivities.length > 10 && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="gap-2"
                    >
                        <ChevronUp className="w-4 h-4" />
                        بازگشت به بالا
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ActivityPage;