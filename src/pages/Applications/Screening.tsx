// frontend-company/src/pages/Applications/Screening.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { fetchApplications } from '../../store/slices/applications.slice';
import { fetchAIScreeningData } from '../../store/slices/dashboard.slice';
import { AIScreeningDashboard } from '../../components/ai/AIScreeningDashboard';
import { Button } from '../../components/common/UI/Button';
import { Badge } from '../../components/common/UI/Badge';
import { ProgressBar } from '../../components/common/UI/ProgressBar';
import {
    Brain,
    Activity,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    Award,
    Download,
    Search,
    Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const ScreeningPage: React.FC = () => {
    const dispatch = useAppDispatch();
    
    const { applications = [], isLoading } = useAppSelector((state) => state.applications);
    const { screeningData } = useAppSelector((state) => state.dashboard);
    
    const [filter, setFilter] = useState<'all' | 'screened' | 'pending' | 'high' | 'medium' | 'low'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchApplications());
        dispatch(fetchAIScreeningData());
    }, [dispatch]);

    const handleExport = () => {
        toast.success('گزارش غربالگری با موفقیت خروجی گرفته شد!');
    };

    const stats = useMemo(() => {
        const total = applications.length;
        const screened = applications.filter(app => app.aiScore !== null && app.aiScore !== undefined);
        const pending = applications.filter(app => app.aiScore === null || app.aiScore === undefined);
        const high = screened.filter(app => app.aiScore !== undefined && app.aiScore >= 70);
        const medium = screened.filter(app => app.aiScore !== undefined && app.aiScore >= 40 && app.aiScore < 70);
        const low = screened.filter(app => app.aiScore !== undefined && app.aiScore < 40);

        const averageScore = screened.length > 0
            ? screened.reduce((sum, app) => sum + (app.aiScore || 0), 0) / screened.length
            : 0;

        const screeningRate = total > 0 ? (screened.length / total) * 100 : 0;
        const highRate = total > 0 ? (high.length / total) * 100 : 0;
        
        const uniqueActiveJobs = new Set(applications.map(a => a?.jobId).filter(Boolean)).size;

        return {
            total,
            screened: screened.length,
            pending: pending.length,
            high: high.length,
            medium: medium.length,
            low: low.length,
            averageScore,
            screeningRate,
            highRate,
            activeJobs: uniqueActiveJobs
        };
    }, [applications]);

    const filteredApplications = useMemo(() => {
        let filtered = [...applications];

        if (filter === 'screened') {
            filtered = filtered.filter(app => app.aiScore !== null && app.aiScore !== undefined);
        } else if (filter === 'pending') {
            filtered = filtered.filter(app => app.aiScore === null || app.aiScore === undefined);
        } else if (filter === 'high') {
            filtered = filtered.filter(app => app.aiScore !== null && app.aiScore !== undefined && app.aiScore >= 70);
        } else if (filter === 'medium') {
            filtered = filtered.filter(app => app.aiScore !== null && app.aiScore !== undefined && app.aiScore >= 40 && app.aiScore < 70);
        } else if (filter === 'low') {
            filtered = filtered.filter(app => app.aiScore !== null && app.aiScore !== undefined && app.aiScore < 40);
        }

        // if (searchTerm) {
        //     const term = searchTerm.toLowerCase();
        //     filtered = filtered.filter(app =>
        //         app.candidateName?.toLowerCase().includes(term) ||
        //         app.jobTitle?.toLowerCase().includes(term)
        //     );
        // }

        return filtered;
    }, [applications, filter, searchTerm]);

    if (isLoading && applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4" dir="rtl">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-indigo-500" />
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری داده‌های غربالگری...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        داشبورد غربالگری هوش مصنوعی
                        <Badge variant="info" size="sm" className="mr-2">
                            <Activity className="w-3 h-3 ml-1" />
                            {stats.screeningRate.toFixed(0)}% پوشش
                        </Badge>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                        نظارت بر غربالگری داوطلبان مبتنی بر هوش مصنوعی در همه مشاغل
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
                        <Download className="w-4 h-4" />
                        خروجی گزارش
                    </Button>
                </div>
            </div>

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
                    <p className="text-xs text-gray-500 dark:text-gray-400">کل</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">درخواست</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
                    <p className="text-xs text-gray-500 dark:text-gray-400">غربال شده</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.screened}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <ProgressBar value={stats.screeningRate} max={100} className="h-1 flex-1" color="green" />
                        <span className="text-xs text-gray-400">{stats.screeningRate.toFixed(0)}%</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
                    <p className="text-xs text-gray-500 dark:text-gray-400">در انتظار</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">در انتظار تحلیل AI</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
                    <p className="text-xs text-gray-500 dark:text-gray-400">تطابق بالا</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.high}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{stats.highRate.toFixed(0)}% از کل</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
                    <p className="text-xs text-gray-500 dark:text-gray-400">میانگین امتیاز</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(stats.averageScore)}%</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">میانگین کلی</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
                    <p className="text-xs text-gray-500 dark:text-gray-400">مشاغل فعال</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.activeJobs}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">با غربالگری AI</p>
                </div>
            </div>

            {/* Filter and Search Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>همه</Button>
                    <Button variant={filter === 'screened' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('screened')} className="gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> غربال شده
                    </Button>
                    <Button variant={filter === 'pending' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('pending')} className="gap-1">
                        <Clock className="w-3.5 h-3.5" /> در انتظار
                    </Button>
                    <Button variant={filter === 'high' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('high')} className="gap-1">
                        <Star className="w-3.5 h-3.5" /> بالا
                    </Button>
                    <Button variant={filter === 'medium' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('medium')} className="gap-1">
                        <Award className="w-3.5 h-3.5" /> متوسط
                    </Button>
                    <Button variant={filter === 'low' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('low')} className="gap-1">
                        <XCircle className="w-3.5 h-3.5" /> پایین
                    </Button>
                </div>

                <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="جستجوی داوطلبان..."
                        className="pr-9 pl-4 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-48 md:w-64 text-right"
                    />
                </div>
            </div>

            {/* Results Counters */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>
                    نمایش <span className="font-medium text-gray-900 dark:text-white">{filteredApplications.length}</span> داوطلب
                    {filter !== 'all' && (
                        <span className="mr-1">با تطابق <span className="font-medium">
                            {filter === 'high' ? 'بالا' : 
                             filter === 'medium' ? 'متوسط' : 
                             filter === 'low' ? 'پایین' : 
                             filter === 'screened' ? 'غربال شده' : 
                             filter === 'pending' ? 'در انتظار' : ''}
                        </span></span>
                    )}
                </span>
                <Badge variant="gray" size="sm">
                    {filter !== 'all' ? 
                        (filter === 'high' ? 'بالا' : 
                         filter === 'medium' ? 'متوسط' : 
                         filter === 'low' ? 'پایین' : 
                         filter === 'screened' ? 'غربال شده' : 
                         filter === 'pending' ? 'در انتظار' : '') : 'همه'} نمایش
                </Badge>
            </div>

            {/* Render Dashboard Content */}
            {screeningData && (
                <AIScreeningDashboard data={screeningData} applications={filteredApplications} />
            )}

            {/* Empty Context Fallbacks */}
            {filteredApplications.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Users className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">هیچ درخواستی یافت نشد</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {searchTerm ? 'سعی کنید جستجو یا فیلترهای خود را تنظیم کنید' : 'برای مشاهده غربالگری هوش مصنوعی، دریافت درخواست‌ها را شروع کنید'}
                    </p>
                    {searchTerm && (
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSearchTerm('');
                                setFilter('all');
                            }}
                        >
                            پاک کردن فیلترها
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScreeningPage;