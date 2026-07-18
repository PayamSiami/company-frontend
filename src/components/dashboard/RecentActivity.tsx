// frontend-company/src/components/dashboard/RecentActivity.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Clock,
    CheckCircle,
    XCircle,
    Users,
    Briefcase,
    FileText,
    Star,
    Calendar,
    ArrowRight,
    UserPlus,
    Sparkles,
    Activity,
    Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../common/UI/Card';
import { Badge } from '../common/UI/Badge';
import { cn } from '../../lib/utils';

interface RecentActivityProps {
    activities?: Activity[];
    className?: string;
    limit?: number;
}

interface Activity {
    id: string;
    type: 'application' | 'shortlist' | 'interview' | 'job' | 'candidate' | 'ai';
    title: string;
    description?: string;
    timestamp: string | Date;
    status?: 'pending' | 'completed' | 'in-progress' | 'rejected';
    link?: string;
    user?: {
        name: string;
        avatar?: string;
    };
}

const defaultActivities: Activity[] = [
    {
        id: '1',
        type: 'application',
        title: 'New application for Senior Developer',
        description: 'John Doe applied for Senior Developer position',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'pending',
        link: '/applications/1',
        user: { name: 'John Doe' }
    },
    {
        id: '2',
        type: 'shortlist',
        title: 'Candidate shortlisted',
        description: 'Jane Smith was shortlisted for UX Designer role',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'completed',
        link: '/candidates/2',
        user: { name: 'Jane Smith' }
    },
    {
        id: '3',
        type: 'interview',
        title: 'Interview scheduled',
        description: 'Mike Johnson scheduled for interview at 2:00 PM',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'in-progress',
        link: '/applications/3',
        user: { name: 'Mike Johnson' }
    },
    {
        id: '4',
        type: 'ai',
        title: 'AI screening completed',
        description: '15 candidates screened for DevOps position',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        status: 'completed',
        link: '/ai/screening',
    },
    {
        id: '5',
        type: 'job',
        title: 'New job posted',
        description: 'Senior Full Stack Developer position posted',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        status: 'completed',
        link: '/jobs/5',
    },
];

const getActivityIcon = (type: Activity['type']) => {
    const icons = {
        application: FileText,
        shortlist: Star,
        interview: Calendar,
        job: Briefcase,
        candidate: Users,
        ai: Sparkles,
    };
    return icons[type] || Activity;
};

const getActivityColor = (type: Activity['type']) => {
    const colors = {
        application: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        shortlist: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
        interview: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        job: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
        candidate: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
        ai: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    };
    return colors[type] || 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
};

const getStatusBadge = (status?: Activity['status']) => {
    if (!status) return null;
    const variants = {
        pending: { variant: 'warning' as const, label: 'Pending' },
        completed: { variant: 'success' as const, label: 'Completed' },
        'in-progress': { variant: 'info' as const, label: 'In Progress' },
        rejected: { variant: 'danger' as const, label: 'Rejected' },
    };
    const config = variants[status];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
    activities = defaultActivities,
    className = '',
    limit = 5
}) => {
    const displayActivities = activities.slice(0, limit);

    const formatTime = (timestamp: string | Date) => {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gray-400" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>Latest updates from your hiring process</CardDescription>
                </div>
                <Link
                    to="/activity"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                    View all
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayActivities.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No recent activity</p>
                        </div>
                    ) : (
                        displayActivities.map((activity) => {
                            const Icon = getActivityIcon(activity.type);
                            const colorClass = getActivityColor(activity.type);

                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                >
                                    <div className={cn("p-2 rounded-lg flex-shrink-0", colorClass)}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {activity.title}
                                                </p>
                                                {activity.description && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        {activity.description}
                                                    </p>
                                                )}
                                                {activity.user && (
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                        by {activity.user.name}
                                                    </p>
                                                )}
                                            </div>
                                            {activity.status && getStatusBadge(activity.status)}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatTime(activity.timestamp)}
                                            </span>
                                            {activity.link && (
                                                <Link
                                                    to={activity.link}
                                                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    View
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentActivity;