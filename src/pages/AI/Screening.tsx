// frontend-company/src/pages/AI/Screening.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { fetchApplications } from '../../store/slices/applications.slice';
import { fetchAIScreeningData } from '../../store/slices/dashboard.slice';
import { AIScreeningDashboard } from '../../components/ai/AIScreeningDashboard';
import { AIScoreCard } from '../../components/ai/AIScoreCard';
import { Button } from '../../components/common/UI/Button';
import { Badge } from '../../components/common/UI/Badge';
import { ProgressBar } from '../../components/common/UI/ProgressBar';
import {
    Users,
    Clock,
    CheckCircle,
    XCircle,
    Brain,
    Activity,
    Star,
    Award,
    FileText,
    Search,
    List,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppDispatch } from '../../store/hooks';

type FilterType = 'all' | 'screened' | 'pending' | 'high' | 'medium' | 'low';
type SortByType = 'score' | 'date' | 'name'; // Added type

const AIScreeningPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { applications, isLoading } = useSelector((state: RootState) => state.applications);
    const { screeningData } = useSelector((state: RootState) => state.dashboard);
    const [filter, setFilter] = useState<FilterType>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('score');

    useEffect(() => {
        dispatch(fetchApplications());
        dispatch(fetchAIScreeningData());
    }, [dispatch]);

    const filteredApplications = useMemo(() => {
        let filtered = applications?.filter((app: any) => {
            if (filter === 'all') return true;
            if (filter === 'screened') return app.aiScore !== null && app.aiScore !== undefined;
            if (filter === 'pending') return app.aiScore === null || app.aiScore === undefined;
            if (filter === 'high') return app.aiScore !== null && app.aiScore >= 70;
            if (filter === 'medium') return app.aiScore !== null && app.aiScore >= 40 && app.aiScore < 70;
            if (filter === 'low') return app.aiScore !== null && app.aiScore < 40;
            return true;
        });

        return filtered
    }, [applications, filter, searchTerm, sortBy]);

    console.log(filteredApplications)

    const stats = useMemo(() => {
        const screenedApps = applications?.filter(a => a.aiScore !== null && a.aiScore !== undefined);
        const screenedCount = screenedApps?.length;
        const totalCount = applications?.length;

        return {
            total: totalCount,
            screened: screenedCount,
            pending: applications?.filter(a => a.aiScore === null || a.aiScore === undefined).length,
            high: applications?.filter(a => a?.aiScore && a?.aiScore >= 70).length,
            medium: applications?.filter(a => a.aiScore && a.aiScore >= 40 && a.aiScore < 70).length,
            low: applications?.filter(a => a.aiScore && a.aiScore < 40).length,
            averageScore: screenedCount > 0
                ? screenedApps.reduce((sum, a) => sum + (a.aiScore || 0), 0) / screenedCount
                : 0,
        };
    }, [applications]);

    const filterOptions: { value: FilterType; label: string; icon: React.ElementType }[] = [
        { value: 'all', label: 'All', icon: Users },
        { value: 'screened', label: 'Screened', icon: CheckCircle },
        { value: 'pending', label: 'Pending', icon: Clock },
        { value: 'high', label: 'High Match', icon: Star },
        { value: 'medium', label: 'Medium Match', icon: Award },
        { value: 'low', label: 'Low Match', icon: XCircle },
    ];

    if (isLoading && applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-indigo-500" />
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Loading screening data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                AI Screening
                                <Badge variant="info" size="sm" className="ml-2">
                                    <Activity className="w-3 h-3 mr-1" />
                                    {stats.screened} screened
                                </Badge>
                            </h1>
                            <p className="flex text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                Automatically screen candidates using AI
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Improved responsiveness */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                    { label: 'Total', value: stats.total, color: 'text-gray-900 dark:text-white' },
                    { label: 'Screened', value: stats.screened, color: 'text-green-600 dark:text-green-400', progress: (stats.screened / stats.total) * 100 || 0, progressColor: 'green' },
                    { label: 'Pending', value: stats.pending, color: 'text-yellow-600 dark:text-yellow-400', progress: (stats.pending / stats.total) * 100 || 0, progressColor: 'yellow' },
                    { label: 'High Match', value: stats.high, color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Medium Match', value: stats.medium, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Low Match', value: stats.low, color: 'text-red-600 dark:text-red-400' },
                    { label: 'Avg Score', value: `${Math.round(stats.averageScore)}%`, color: 'text-indigo-600 dark:text-indigo-400' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-3 hover:shadow-md transition-all">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className={`text-xl font-bold ${stat.color}`}>
                            {stat.value}
                        </p>
                        {stat.progress !== undefined && (
                            <ProgressBar value={stat.progress} max={100} className="h-1 mt-1" color={stat.progressColor as any} />
                        )}
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    {filterOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={filter === option.value ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(option.value)}
                            className="gap-1.5"
                        >
                            <option.icon className="w-3.5 h-3.5" />
                            {option.label}
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search candidates..."
                            className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-48 md:w-56"
                            aria-label="Search candidates"
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortByType)} // Fixed type casting
                        className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Sort applications"
                    >
                        <option value="score">Sort by Score</option>
                        <option value="date">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                    </select>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                viewMode === 'grid'
                                    ? "bg-white dark:bg-gray-700 shadow-sm"
                                    : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                            )}
                            aria-label="Grid view"
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
                            aria-label="List view"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Screening Dashboard - Only show if data exists */}
            {screeningData && Object.keys(screeningData).length > 0 && (
                <AIScreeningDashboard data={screeningData} />
            )}

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Showing {filteredApplications?.length} candidates</span>
                <span className="flex items-center gap-2">
                    <Badge variant="gray" size="sm">
                        {filter} filter
                    </Badge>
                    {searchTerm && (
                        <Badge variant="gray" size="sm">
                            Search: "{searchTerm}"
                        </Badge>
                    )}
                </span>
            </div>

            {/* AI Score Cards */}
            {filteredApplications?.length > 0 ? (
                <div className={cn(
                    "grid gap-4",
                    viewMode === 'grid'
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                )}>
                    {filteredApplications?.map((app) => (
                        <AIScoreCard
                            key={app._id}
                            application={app}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Users className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No applications found</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {searchTerm ? 'No results match your search criteria' : 'Try adjusting your filters or search terms'}
                    </p>
                    {(filter !== 'all' || searchTerm) && (
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setFilter('all');
                                setSearchTerm('');
                            }}
                        >
                            Clear all filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIScreeningPage;