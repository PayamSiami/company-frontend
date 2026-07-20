// frontend-company/src/components/jobs/JobList.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    MapPin,
    Calendar,
    Users,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Building2,
    Copy,
    Archive,
    Send,
    ChevronDown,
    ChevronUp,
    Search,
    Plus
} from 'lucide-react';
import { Card, CardContent } from '../common/UI/Card';
import { Badge } from '../common/UI/Badge';
import { Button } from '../common/UI/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../common/UI/DropdownMenu';
import { cn } from '../../lib/utils';
import { formatDate } from '../../utils/utils';

interface Job {
    _id: string;
    title: string;
    description: string;
    companyId: string;
    companyName?: string;
    location: {
        city: string;
        state?: string;
        country: string;
    };
    salaryRange?: {
        min: number;
        max: number;
        currency: string;
    };
    jobType: string;
    workMode: string;
    experienceLevel: string;
    status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'EXPIRED' | 'FILLED';
    isActive: boolean;
    applicationCount?: number;
    createdAt: string;
    expiresAt?: string;
}

interface JobListProps {
    jobs: any;
    view?: 'grid' | 'list';
    loading?: boolean;
    onSelect?: (ids: string[]) => void;
    selectedIds?: string[];
    onRefresh?: () => void;
    onDelete?: (id: string) => void;
    onDuplicate?: (id: string) => void;
    onArchive?: (id: string) => void;
    onPublish?: (id: string) => void;
    onClose?: (id: string) => void;
}

const JobCard: React.FC<{ job: Job; onAction?: (action: string, id: string) => void }> = ({
    job,
    onAction
}) => {
    const [expanded, setExpanded] = useState(false);

    const getStatusConfig = (status: string) => {
        const configs = {
            OPEN: { label: 'فعال', variant: 'success' as const, icon: CheckCircle },
            DRAFT: { label: 'پیش‌نویس', variant: 'gray' as const, icon: Clock },
            CLOSED: { label: 'بسته شده', variant: 'gray' as const, icon: XCircle },
            EXPIRED: { label: 'منقضی شده', variant: 'danger' as const, icon: AlertCircle },
            FILLED: { label: 'تکمیل شده', variant: 'success' as const, icon: CheckCircle },
        };
        return configs[status as keyof typeof configs] || configs.DRAFT;
    };

    const statusConfig = getStatusConfig(job.status);

    const getJobTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            FULL_TIME: 'تمام وقت',
            PART_TIME: 'پاره وقت',
            CONTRACT: 'قراردادی',
            INTERNSHIP: 'کارآموزی',
            FREELANCE: 'آزاد',
            REMOTE: 'دورکاری'
        };
        return types[type] || type;
    };

    const handleAction = (action: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAction?.(action, job._id);
    };

    return (
        <Card
            className={cn(
                "hover:shadow-md transition-shadow cursor-pointer group",
                job.status === 'CLOSED' || job.status === 'EXPIRED' ? "opacity-75" : ""
            )}
            onClick={() => setExpanded(!expanded)}
            dir="rtl"
        >
            <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                {job.title}
                            </h3>
                            <Badge variant={statusConfig.variant} size="sm" className="flex items-center gap-1 flex-shrink-0">
                                <statusConfig.icon className="w-3 h-3" />
                                {statusConfig.label}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" />
                                {job.companyName || 'شرکت نامشخص'}
                            </span>
                            {job.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {job.location.city}, {job.location.country}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5" />
                                {getJobTypeLabel(job.jobType)}
                            </span>
                            {job.applicationCount !== undefined && (
                                <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    {job.applicationCount} درخواست
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {job.salaryRange && (
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()} {job.salaryRange.currency}
                            </span>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <Link to={`/jobs/${job._id}`}>
                                    <DropdownMenuItem className="gap-2">
                                        <Eye className="w-4 h-4" />
                                        مشاهده جزئیات
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={(e) => handleAction('edit', e)} className="gap-2">
                                    <Edit className="w-4 h-4" />
                                    ویرایش
                                </DropdownMenuItem>
                                {job.status === 'DRAFT' && (
                                    <DropdownMenuItem onClick={(e) => handleAction('publish', e)} className="gap-2">
                                        <Send className="w-4 h-4" />
                                        انتشار
                                    </DropdownMenuItem>
                                )}
                                {job.status === 'OPEN' && (
                                    <DropdownMenuItem onClick={(e) => handleAction('close', e)} className="gap-2">
                                        <XCircle className="w-4 h-4" />
                                        بستن
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={(e) => handleAction('duplicate', e)} className="gap-2">
                                    <Copy className="w-4 h-4" />
                                    کپی کردن
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleAction('archive', e)} className="gap-2">
                                    <Archive className="w-4 h-4" />
                                    بایگانی
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleAction('delete', e)} className="gap-2 text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                    حذف
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Expanded Details */}
                {expanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 text-right">
                            {job.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                تاریخ ثبت: {formatDate(job.createdAt)}
                            </span>
                            {job.expiresAt && (
                                <span className="flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    انقضا: {formatDate(job.expiresAt)}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {job.applicationCount || 0} درخواست
                            </span>
                            <Badge variant="gray" size="sm">
                                {job.experienceLevel}
                            </Badge>
                            <Badge variant="gray" size="sm">
                                {job.workMode}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Expand indicator */}
                <div className="flex justify-center mt-2">
                    {expanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export const JobList: React.FC<JobListProps> = ({
    jobs,
    view = 'list',
    loading = false,
    onDelete,
    onDuplicate,
    onArchive,
    onPublish,
    onClose
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'applications' | 'title'>('newest');

    const handleAction = (action: string, id: string) => {
        switch (action) {
            case 'delete': onDelete?.(id); break;
            case 'duplicate': onDuplicate?.(id); break;
            case 'archive': onArchive?.(id); break;
            case 'publish': onPublish?.(id); break;
            case 'close': onClose?.(id); break;
            case 'view':
            case 'edit':
                break;
        }
    };

    const filteredJobs = jobs?.filter((job: any) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'applications':
                return (b.applicationCount || 0) - (a.applicationCount || 0);
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4" dir="rtl">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری مشاغل...</p>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50" dir="rtl">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Briefcase className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">هیچ شغلی یافت نشد</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    برای جذب داوطلبان، ثبت آگهی شغلی را شروع کنید
                </p>
                <Link to="/jobs/create">
                    <Button className="mt-4 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="w-4 h-4" />
                        ثبت اولین آگهی شغلی
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4" dir="rtl">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="جستجوی مشاغل..."
                            className="pr-9 pl-4 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-48 md:w-64 text-right"
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">همه وضعیت‌ها</option>
                        <option value="OPEN">فعال</option>
                        <option value="DRAFT">پیش‌نویس</option>
                        <option value="CLOSED">بسته شده</option>
                        <option value="EXPIRED">منقضی شده</option>
                        <option value="FILLED">تکمیل شده</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="newest">جدیدترین</option>
                        <option value="oldest">قدیمی‌ترین</option>
                        <option value="applications">بیشترین درخواست</option>
                        <option value="title">عنوان</option>
                    </select>
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredJobs?.length} {filteredJobs?.length === 1 ? 'شغل' : 'شغل'}
                </span>
            </div>

            {/* Job List */}
            <div className={cn(
                "grid gap-3",
                view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
                {filteredJobs?.length > 0 && sortedJobs.map((job) => (
                    <JobCard
                        key={job._id}
                        job={job}
                        onAction={handleAction}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredJobs?.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Search className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">هیچ شغلی مطابقت ندارد</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">سعی کنید جستجو یا فیلترهای خود را تنظیم کنید</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                            setSearchTerm('');
                            setFilterStatus('all');
                        }}
                    >
                        پاک کردن فیلترها
                    </Button>
                </div>
            )}
        </div>
    );
};

export default JobList;