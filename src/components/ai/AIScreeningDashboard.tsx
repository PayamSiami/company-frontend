// frontend-company/src/components/ai/AIScreeningDashboard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Clock,
    Users,
    BarChart3,
    TrendingUp,
    Eye,
    ChevronRight,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../common/UI/Card';
import { Badge } from '../common/UI/Badge';
import { Button } from '../common/UI/Button';
import { ProgressBar } from '../common/UI/ProgressBar';
import { cn } from '../../lib/utils';

interface AIScreeningDashboardProps {
    data?: any;
    applications?: any[];
    className?: string;
    onRefresh?: () => void;
}

interface ScreeningStat {
    label: string;
    value: number | string;
    change?: number;
    color: string;
}

export const AIScreeningDashboard: React.FC<AIScreeningDashboardProps> = ({
    data,
    applications = [],
    className = '',
}) => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    console.log(data?.screeningHistory)

    // Calculate stats from applications
    const totalApplications = applications.length;
    const screenedApplications = applications?.filter(app => app.aiScore !== null && app.aiScore !== undefined);
    const pendingApplications = applications?.filter(app => app.aiScore === null || app.aiScore === undefined);
    const highScore = screenedApplications?.filter(app => app.aiScore >= 70);
    const mediumScore = screenedApplications?.filter(app => app.aiScore >= 40 && app.aiScore < 70);
    const lowScore = screenedApplications?.filter(app => app.aiScore < 40);

    const averageScore = screenedApplications?.length > 0
        ? screenedApplications?.reduce((sum, app) => sum + (app?.aiScore || 0), 0) / screenedApplications?.length
        : 0;

    const screeningRate = totalApplications > 0 ? (screenedApplications?.length / totalApplications) * 100 : 0;

    const stats: ScreeningStat[] = [
        {
            label: 'Total Applications',
            value: totalApplications,
            color: 'bg-blue-500'
        },
        {
            label: 'Screened',
            value: screenedApplications?.length,
            change: Math.round(screeningRate),
            color: 'bg-green-500'
        },
        {
            label: 'Pending',
            value: pendingApplications?.length,
            color: 'bg-yellow-500'
        },
        {
            label: 'Average Score',
            value: `${Math.round(averageScore)}%`,
            color: 'bg-purple-500'
        }
    ];

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600 dark:text-green-400';
        if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreBadgeVariant = (score: number) => {
        if (score >= 70) return 'success';
        if (score >= 40) return 'warning';
        return 'danger';
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        AI Screening Dashboard
                        <Badge variant="info" size="sm" className="ml-2">
                            <Activity className="w-3 h-3 mr-1" />
                            Live
                        </Badge>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Monitor AI-powered candidate screening across all jobs
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        {(['7d', '30d', '90d'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
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
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    return (
                        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                {stat.change !== undefined && (
                                    <span className={cn(
                                        "text-xs font-medium flex items-center gap-0.5",
                                        stat.change >= 0 ? "text-green-600" : "text-red-600"
                                    )}>
                                        {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {stat.change}%
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </Card>
                    );
                })}
            </div>

            {/* Screening Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Distribution */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                            Score Distribution
                        </CardTitle>
                        <CardDescription>Breakdown of AI match scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-green-600 dark:text-green-400">High (70%+)</span>
                                    <span className="font-medium">{highScore?.length} candidates</span>
                                </div>
                                <ProgressBar
                                    value={(highScore?.length / totalApplications) * 100}
                                    max={100}
                                    className="h-2"
                                    color="green"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-yellow-600 dark:text-yellow-400">Medium (40-69%)</span>
                                    <span className="font-medium">{mediumScore?.length} candidates</span>
                                </div>
                                <ProgressBar
                                    value={(mediumScore?.length / totalApplications) * 100}
                                    max={100}
                                    className="h-2"
                                    color="yellow"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-red-600 dark:text-red-400">Low (&lt;40%)</span>
                                    <span className="font-medium">{lowScore?.length} candidates</span>
                                </div>
                                <ProgressBar
                                    value={(lowScore?.length / totalApplications) * 100}
                                    max={100}
                                    className="h-2"
                                    color="red"
                                />
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Total screened: <span className="font-semibold text-gray-900 dark:text-white">{screenedApplications?.length}</span></span>
                            <span>Coverage: <span className="font-semibold text-gray-900 dark:text-white">{Math.round(screeningRate)}%</span></span>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link to="/ai/screening">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Eye className="w-4 h-4" />
                                View All Screening
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            </Button>
                        </Link>
                        <Link to="/applications/screening">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Users className="w-4 h-4" />
                                Review Applications
                                <Badge variant="danger" size="sm" className="ml-auto">
                                    {pendingApplications?.length}
                                </Badge>
                            </Button>
                        </Link>
                        <Link to="/ai/assistant">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Sparkles className="w-4 h-4" />
                                AI Job Assistant
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            </Button>
                        </Link>
                        <Link to="/ai/analytics">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <TrendingUp className="w-4 h-4" />
                                View Analytics
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Screening History */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Screening History
                        </CardTitle>
                        <CardDescription>Recent AI screening results by job</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-sm">
                        View all
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Applicants
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Screened
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Avg. Score
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {data?.screeningHistory?.map((job: any, id: React.Key) => (
                                    <tr key={id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3 text-left">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {job.jobTitle}
                                            </span>
                                        </td>
                                        <td className="text-left px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                            {job.totalApplicants}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-left">
                                            {job.screenedCount} ({Math.round((job.screenedCount / job.totalApplicants) * 100)}%)
                                        </td>
                                        <td className="px-4 py-3 text-left">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-sm font-semibold",
                                                    getScoreColor(job.avgScore)
                                                )}>
                                                    {Math.round(job.avgScore)}%
                                                </span>
                                                <ProgressBar
                                                    value={job.avgScore}
                                                    max={100}
                                                    className="w-16 h-1.5"
                                                    color={job.avgScore >= 70 ? 'green' : job.avgScore >= 40 ? 'yellow' : 'red'}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-left">
                                            <Badge variant={getScoreBadgeVariant(job.avgScore)} size="sm">
                                                {job.avgScore >= 70 ? 'High Match' : job.avgScore >= 40 ? 'Medium Match' : 'Low Match'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AIScreeningDashboard;