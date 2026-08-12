import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Clock,
    Users,
    Briefcase,
    FileText,
    Star,
    Calendar,
    ArrowLeft,
    Sparkles,
    Activity,
    Eye,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../common/UI/Card';
import { Badge } from '../common/UI/Badge';
import { cn } from '../../lib/utils';
import { fetchActivity, selectActivity, selectActivityLoading } from '../../store/slices/activity.slice';
import type { AppDispatch } from '../../store';
import { useDispatch, useSelector } from 'react-redux';

interface ActivityItem {
    id: string;
    type: 'generation' | 'job' | 'application' | 'shortlist' | 'interview' | 'candidate' | 'ai';
    title: string;
    description?: string;
    score: number | null;
    timestamp: string;
    status: 'pending' | 'completed' | 'in-progress' | 'rejected';
    time: string; // Human readable time like "3 hours ago"
    link?: string;
    jobTitle?: string;
    metadata?: {
        jobId?: string;
        isActive?: boolean;
    };
}

// Map API types to icon types
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

// Map API types to color classes
const getActivityColor = (type: ActivityItem['type']) => {
    const colors = {
        generation: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
        job: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
        application: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        shortlist: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
        interview: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        candidate: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
        ai: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    };
    return colors[type] || 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
};

// Get human readable label for activity type
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

// Format time from API's human-readable format or timestamp
const formatTime = (timestamp: string | Date, timeString?: string) => {
    // If we have a human-readable time string from API, use it
    if (timeString) {
        return timeString;
    }

    // Otherwise parse the timestamp
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'همین الان';
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    if (days < 7) return `${days} روز پیش`;
    return date.toLocaleDateString('fa-IR');
};

// Format activity description based on type
const formatDescription = (activity: ActivityItem): string => {
    if (activity.description) return activity.description;

    if (activity.type === 'generation') {
        return `تولید توضیحات شغلی برای "${activity.jobTitle || 'موقعیت'}"`;
    }
    if (activity.type === 'job') {
        return `موقعیت "${activity.jobTitle || 'نامشخص'}" منتشر شد`;
    }
    return '';
};

const limit = 5; // Limit for recent activities
export const RecentActivity: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Get data from Redux store - assuming the selector returns the activities array
    const activities = useSelector(selectActivity);
    const loading = useSelector(selectActivityLoading);

    // Extract activities from the response structure
    const activityItems = useMemo(() => {
        if (!activities) return [];

        // If it's the full response with activities array
        if (Array.isArray(activities)) {
            return activities;
        }

        // If it's the paginated response
        if ('activities' in activities && Array.isArray(activities)) {
            return activities;
        }

        return [];
    }, [activities]);

    useEffect(() => {
        dispatch(fetchActivity({ limit: 6, page: 1 }));
    }, [dispatch]);

    // Display only up to the limit
    const displayActivities = activityItems.slice(0, limit);

    // Group activities to show only the most recent per job (optional)
    // This prevents showing duplicate entries for generation and job posts
    const groupedActivities = useMemo(() => {
        const seenJobIds = new Set();
        return displayActivities.filter((activity: ActivityItem) => {
            if (activity.type === 'job' && activity.metadata?.jobId) {
                if (seenJobIds.has(activity.metadata.jobId)) {
                    return false;
                }
                seenJobIds.add(activity.metadata.jobId);
            }
            return true;
        });
    }, [displayActivities]);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gray-400" />
                        فعالیت‌های اخیر
                    </CardTitle>
                    <CardDescription>آخرین به‌روزرسانی‌های فرآیند استخدام</CardDescription>
                </div>
                {activityItems.length > limit && (
                    <Link
                        to="/activities"
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                        مشاهده همه
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {groupedActivities.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>هیچ فعالیت اخیری وجود ندارد</p>
                        </div>
                    ) : (
                        groupedActivities.map((activity: ActivityItem) => {
                            const Icon = getActivityIcon(activity.type);
                            const colorClass = getActivityColor(activity.type);
                            const description = formatDescription(activity);
                            const timeDisplay = formatTime(activity.timestamp, activity.time);

                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                >
                                    <div className={cn("p-2 rounded-lg shrink-0", colorClass)}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white text-right">
                                                        {activity.title}
                                                    </p>
                                                    {activity.jobTitle && (
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            ({activity.jobTitle})
                                                        </span>
                                                    )}
                                                    {getStatusBadge(activity.status)}
                                                </div>
                                                {description && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-right">
                                                        {description}
                                                    </p>
                                                )}
                                                {activity.metadata?.isActive !== undefined && (
                                                    <Badge
                                                        variant={activity.metadata.isActive ? 'success' : 'secondary'}
                                                        size="sm"
                                                        className="mt-1"
                                                    >
                                                        {activity.metadata.isActive ? 'فعال' : 'غیرفعال'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {timeDisplay}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                {getActivityTypeLabel(activity.type)}
                                            </span>
                                            {activity.link && (
                                                <Link
                                                    to={activity.link}
                                                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    مشاهده
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