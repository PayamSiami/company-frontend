// frontend-company/src/pages/AI/Index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/UI/Button';
import { Card } from '../../components/common/UI/Card';
import { Badge } from '../../components/common/UI/Badge';
import { ProgressBar } from '../../components/common/UI/ProgressBar';
import {
    Sparkles,
    FileSearch,
    BarChart3,
    FileText,
    ArrowRight,
    Star,
    Clock,
    CheckCircle,
    Activity,
    Rocket,
    Wand2,
    Loader2,
    Eye,
    ChevronRight,
    XCircle,
    List,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AITool {
    id: string;
    title: string;
    description: string;
    color: string;
    gradient: string;
    path: string;
    features: string[];
    stats?: {
        label: string;
        value: string;
        change: string;
    };
}

interface Activity {
    id: number;
    title: string;
    score: number | null;
    status: 'completed' | 'in-progress' | 'pending' | 'failed';
    time: string;
    type: 'screening' | 'generation' | 'analytics';
}

const AIPage: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const aiTools: AITool[] = [
        {
            id: 'screening',
            title: 'AI Screening',
            description: 'Automatically screen candidates against job requirements using AI',
            color: 'text-indigo-600 dark:text-indigo-400',
            gradient: 'from-indigo-500 to-purple-600',
            path: '/ai/screening',
            features: [
                'Automatic candidate scoring',
                'Skill match analysis',
                'Experience evaluation',
                'Real-time screening'
            ],
            stats: {
                label: 'Candidates screened',
                value: '1,247',
                change: '+12%'
            }
        },
        {
            id: 'assistant',
            title: 'AI Job Assistant',
            description: 'Generate job descriptions, requirements, and interview questions with AI',
            color: 'text-blue-600 dark:text-blue-400',
            gradient: 'from-blue-500 to-cyan-600',
            path: '/ai/assistant',
            features: [
                'Job description generation',
                'Requirements extraction',
                'Salary suggestions',
                'Interview questions'
            ],
            stats: {
                label: 'Jobs created',
                value: '48',
                change: '+8%'
            }
        },
        {
            id: 'analytics',
            title: 'AI Analytics',
            description: 'Get insights into your hiring process with AI-powered analytics',
            color: 'text-purple-600 dark:text-purple-400',
            gradient: 'from-purple-500 to-pink-600',
            path: '/ai/analytics',
            features: [
                'Hiring trends',
                'Candidate insights',
                'Market analysis',
                'Performance metrics'
            ],
            stats: {
                label: 'Reports generated',
                value: '156',
                change: '+5%'
            }
        }
    ];

    const recentActivities: Activity[] = [
        {
            id: 1,
            title: 'Candidate screened for Senior Developer',
            score: 85,
            status: 'completed',
            time: '2 hours ago',
            type: 'screening'
        },
        {
            id: 2,
            title: 'Job description generated for DevOps Engineer',
            score: null,
            status: 'completed',
            time: '4 hours ago',
            type: 'generation'
        },
        {
            id: 3,
            title: 'AI screening in progress for 15 candidates',
            score: null,
            status: 'in-progress',
            time: 'Just now',
            type: 'screening'
        },
        {
            id: 4,
            title: 'Analytics report generated for Q4 hiring',
            score: 92,
            status: 'completed',
            time: '6 hours ago',
            type: 'analytics'
        }
    ];

    const quickStats = [
        { label: 'Total AI Screenings', value: '1,247', change: '+12%', color: 'text-green-600' },
        { label: 'Avg. Screening Score', value: '76%', change: '+5%', color: 'text-green-600' },
        { label: 'Jobs with AI', value: '48', change: '78%', color: 'text-blue-600' },
        { label: 'Time Saved', value: '~40h', change: 'Using AI automation', color: 'text-green-600' },
    ];

    const getStatusIcon = (status: Activity['status']) => {
        switch (status) {
            case 'completed':
                return CheckCircle;
            case 'in-progress':
                return Loader2;
            case 'pending':
                return Clock;
            case 'failed':
                return XCircle;
            default:
                return Clock;
        }
    };

    const getStatusColor = (status: Activity['status']) => {
        switch (status) {
            case 'completed':
                return 'text-green-500 bg-green-50 dark:bg-green-900/20';
            case 'in-progress':
                return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'pending':
                return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
            case 'failed':
                return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            default:
                return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
        }
    };

    const getTypeIcon = (type: Activity['type']) => {
        switch (type) {
            case 'screening':
                return FileSearch;
            case 'generation':
                return Wand2;
            case 'analytics':
                return BarChart3;
            default:
                return Sparkles;
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                AI Tools
                                <Badge variant="info" size="sm" className="ml-2">
                                    <Activity className="w-3 h-3 mr-1" />
                                    Live
                                </Badge>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                Leverage AI to streamline your hiring process
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                viewMode === 'grid'
                                    ? "bg-white dark:bg-gray-700 shadow-sm"
                                    : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                            )}
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
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/ai/assistant')}
                        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                    >
                        <Wand2 className="h-4 w-4" />
                        Try AI Assistant
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                        <p className={cn("text-xs mt-1", stat.color)}>{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* AI Tools Grid */}
            <div className={cn(
                "grid gap-6",
                viewMode === 'grid'
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
            )}>
                {aiTools.map((tool) => (
                    <div
                        key={tool.id}
                        className={cn(
                            "group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer",
                            viewMode === 'list' && "flex flex-col md:flex-row md:items-center gap-4 p-6"
                        )}
                        onClick={() => navigate(tool.path)}
                    >
                        {/* Gradient overlay */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500",
                            `bg-linear-to-br ${tool.gradient}`
                        )} />

                        <div className={cn(
                            "p-6",
                            viewMode === 'list' && "flex-1"
                        )}>
                            <div className="flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {tool.description}
                                    </p>
                                    {tool.stats && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-gray-400">{tool.stats.label}:</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {tool.stats.value}
                                            </span>
                                            <span className="text-xs text-green-600">
                                                {tool.stats.change}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors shrink-0" />
                            </div>

                            {/* Features */}
                            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {tool.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action */}
                            <Button
                                variant="outline"
                                className="mt-4 w-full gap-2 group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(tool.path);
                                }}
                            >
                                Get Started
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-400" />
                            Recent AI Activity
                        </h2>
                        <Button variant="ghost" size="sm" className="gap-1 text-sm">
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                        {recentActivities.map((activity) => {
                            const StatusIcon = getStatusIcon(activity.status);
                            const TypeIcon = getTypeIcon(activity.type);
                            const isCompleted = activity.status === 'completed';

                            return (
                                <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={cn(
                                            "p-2 rounded-xl shrink-0",
                                            getStatusColor(activity.status)
                                        )}>
                                            <StatusIcon className={cn(
                                                "w-4 h-4",
                                                activity.status === 'in-progress' && "animate-spin"
                                            )} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {activity.title}
                                                </p>
                                                <TypeIcon className="w-3 h-3 text-gray-400 shrink-0" />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        {activity.score !== null && isCompleted && (
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {activity.score}%
                                                </span>
                                            </div>
                                        )}
                                        <Badge
                                            variant={activity.status === 'completed' ? 'success' : 'warning'}
                                            size="sm"
                                            className="capitalize"
                                        >
                                            {activity.status === 'in-progress' ? 'In Progress' : activity.status}
                                        </Badge>
                                        {isCompleted && (
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions / Insights */}
                <div className="space-y-4">
                    <Card className="p-5 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">AI Tip of the Day</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Use specific keywords in job titles for better candidate matching.
                                </p>
                                <Button size="sm" className="mt-2 px-0 text-blue-600">
                                    Learn more
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">AI Usage</h4>
                            <Badge variant="info" size="sm">This month</Badge>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Screenings</span>
                                    <span className="font-medium">78%</span>
                                </div>
                                <ProgressBar value={78} max={100} className="h-1.5 mt-1" color="indigo" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Generations</span>
                                    <span className="font-medium">45%</span>
                                </div>
                                <ProgressBar value={45} max={100} className="h-1.5 mt-1" color="blue" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Analytics</span>
                                    <span className="font-medium">62%</span>
                                </div>
                                <ProgressBar value={62} max={100} className="h-1.5 mt-1" color="purple" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIPage;