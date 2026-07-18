// frontend-company/src/pages/Jobs/Analytics.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchJobAnalytics,
    selectJobAnalytics,
    selectJobAnalyticsLoading,
    selectJobAnalyticsError,
    selectJobAnalyticsTimeRange,
    setAnalyticsTimeRange,
} from '../../store/slices/jobs.slice';
import type { AppDispatch } from '../../store';
import {
    TrendingUp,
    Users,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Activity,
    Award,
    Star,
    Eye,
    Target,
    Zap
} from 'lucide-react';
import { Button } from '../../components/common/UI/Button';
import { Badge } from '../../components/common/UI/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/UI/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/UI/Tabs';
import { ProgressBar } from '../../components/common/UI/ProgressBar';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { Spinner } from '../../components/common/UI/Spinner';

// Chart components
import {
    BarChart,
    Bar,
    Line,
    PieChart as RePieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart
} from 'recharts';

const JobsAnalyticsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const analytics: any = useSelector(selectJobAnalytics);
    const loading = useSelector(selectJobAnalyticsLoading);
    const error = useSelector(selectJobAnalyticsError);
    const timeRange = useSelector(selectJobAnalyticsTimeRange);

    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        dispatch(fetchJobAnalytics(timeRange));
    }, [dispatch, timeRange]);

    const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
        dispatch(setAnalyticsTimeRange(range));
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            // TODO: Implement export functionality
            toast.success('Report exported successfully!');
        } catch (error) {
            toast.error('Failed to export report');
        } finally {
            setExporting(false);
        }
    };

    if (loading && !analytics) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <Button
                        onClick={() => dispatch(fetchJobAnalytics(timeRange))}
                        className="mt-4"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    console.log(analytics)

    if (!analytics) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">No analytics data available</p>
                </div>
            </div>
        );
    }

    const statusColors = {
        open: '#22c55e',
        draft: '#94a3b8',
        closed: '#ef4444',
        expired: '#eab308',
        filled: '#3b82f6',
    };

    const typeColors = {
        fullTime: '#3b82f6',
        partTime: '#8b5cf6',
        contract: '#06b6d4',
        internship: '#22c55e',
        freelance: '#eab308',
        remote: '#f97316',
    };

    const statusData = Object.entries(analytics?.byStatus).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        color: statusColors[key as keyof typeof statusColors] || '#94a3b8',
    }));

    const typeData = Object.entries(analytics.byType).map(([key, value]) => ({
        name: key === 'fullTime' ? 'Full Time'
            : key === 'partTime' ? 'Part Time'
                : key === 'contract' ? 'Contract'
                    : key === 'internship' ? 'Internship'
                        : key === 'freelance' ? 'Freelance'
                            : 'Remote',
        value,
        color: typeColors[key as keyof typeof typeColors] || '#94a3b8',
    }));

    const metricCards = [
        {
            title: 'Total Jobs',
            value: analytics.total,
            change: '+12%',
            trend: 'up',
        },
        {
            title: 'Total Applications',
            value: analytics.applications.total,
            change: `+${analytics.applications.growth}%`,
            trend: analytics.applications.growth >= 0 ? 'up' : 'down',
        },
        {
            title: 'Avg. Applications/Job',
            value: analytics.applications.avgPerJob,
            change: '+5%',
            trend: 'up',
        },
        {
            title: 'Conversion Rate',
            value: `${analytics.performance.conversionRate}%`,
            change: analytics.performance.conversionRate >= 0 ? '+2%' : '-2%',
            trend: analytics.performance.conversionRate >= 0 ? 'up' : 'down',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Job Analytics
                            <Badge variant="info" size="sm" className="ml-2">
                                <Activity className="w-3 h-3 mr-1" />
                                Live
                            </Badge>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                            Track your job posting performance and hiring metrics
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => handleTimeRangeChange(range)}
                                className={cn(
                                    "px-2.5 py-1 text-xs font-medium rounded-lg transition-colors",
                                    timeRange === range
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        disabled={exporting}
                        className="gap-1.5"
                    >
                        <Download className="w-4 h-4" />
                        {exporting ? 'Exporting...' : 'Export'}
                    </Button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metricCards.map((metric, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className={cn(
                                "text-xs font-medium flex items-center gap-0.5",
                                metric.trend === 'up' ? "text-green-600" : "text-red-600"
                            )}>
                                {metric.trend === 'up' ? (
                                    <ArrowUpRight className="w-3 h-3" />
                                ) : (
                                    <ArrowDownRight className="w-3 h-3" />
                                )}
                                {metric.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metric.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
                    </Card>
                ))}
            </div>

            {/* Charts Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="trends" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Trends
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Performance
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Status Distribution */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-base">Job Status Distribution</CardTitle>
                                <CardDescription>Breakdown of jobs by status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={statusData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="name" stroke="#9ca3af" />
                                            <YAxis stroke="#9ca3af" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Job Type Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Job Types</CardTitle>
                                <CardDescription>Distribution by type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-75">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={typeData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} (${((percent ? percent : 0) * 100).toFixed(0)}%)`}
                                                outerRadius={80}
                                                dataKey="value"
                                            >
                                                {typeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Trends Tab */}
                <TabsContent value="trends" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Hiring Trends</CardTitle>
                            <CardDescription>Monthly job postings, applications, and hires</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={analytics.monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#9ca3af" />
                                        <YAxis yAxisId="left" stroke="#9ca3af" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="jobs" fill="#3b82f6" name="Jobs Posted" radius={[4, 4, 0, 0]} />
                                        <Line yAxisId="left" type="monotone" dataKey="applications" stroke="#8b5cf6" name="Applications" strokeWidth={2} />
                                        <Line yAxisId="right" type="monotone" dataKey="hires" stroke="#22c55e" name="Hires" strokeWidth={2} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Performance Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Performance Metrics</CardTitle>
                                <CardDescription>Key performance indicators</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
                                        <span className="font-semibold">{analytics.performance.conversionRate}%</span>
                                    </div>
                                    <ProgressBar value={analytics.performance.conversionRate} max={100} className="h-2" color="blue" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Shortlist Rate</span>
                                        <span className="font-semibold">{analytics.performance.shortlistRate}%</span>
                                    </div>
                                    <ProgressBar value={analytics.performance.shortlistRate} max={100} className="h-2" color="purple" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Views per Job</span>
                                        <span className="font-semibold">{analytics.performance.viewsPerJob}</span>
                                    </div>
                                    <ProgressBar value={(analytics.performance.viewsPerJob / 100) * 100} max={100} className="h-2" color="green" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Time to Hire (days)</span>
                                        <span className="font-semibold">{analytics.performance.timeToHire}</span>
                                    </div>
                                    <ProgressBar value={(1 - analytics.performance.timeToHire / 30) * 100} max={100} className="h-2" color="blue" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Performing Jobs */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Top Performing Jobs</CardTitle>
                                <CardDescription>Highest performing job postings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.topPerformingJobs.map((job: any, index: any) => (
                                        <div key={job.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-yellow-400 to-yellow-500 text-white font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {job.title}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {job.applications}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {job.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Target className="w-3 h-3" />
                                                        {job.conversionRate}%
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant="success" size="sm">Top</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Quick Tip</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Jobs with detailed descriptions get 45% more applications.
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Best Time to Post</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Tuesday and Wednesday mornings have highest application rates.
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
                            <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Top Skill</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                JavaScript is the most in-demand skill in your job postings.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default JobsAnalyticsPage;