// frontend-company/src/components/ai/AIScoreCard.tsx
import React from 'react';
import { Eye, Mail } from 'lucide-react';
import { Card } from '../common/UI/Card';
import { Badge } from '../common/UI/Badge';
import { ProgressBar } from '../common/UI/ProgressBar';
import { Button } from '../common/UI/Button';
import { cn } from '../../lib/utils';

interface AIScoreCardProps {
    application: any;
    viewMode?: 'grid' | 'list';
}

export const AIScoreCard: React.FC<AIScoreCardProps> = ({
    application,
    viewMode = 'grid'
}) => {
    const { applicantId , jobId, aiScore, status, createdAt } = application

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

    console.log(application)
    if (viewMode == 'list') {
        return (
            <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {applicantId?.username?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{applicantId?.username|| 'Unknown'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{jobId?.title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className={cn("font-semibold", getScoreColor(aiScore || 0))}>
                                {aiScore || 0}%
                            </span>
                            <ProgressBar value={aiScore || 0} max={100} className="w-20 h-1.5" />
                        </div>
                        <Badge variant={getScoreBadgeVariant(aiScore || 0)}>
                            {aiScore >= 70 ? 'High' : aiScore >= 40 ? 'Medium' : 'Low'}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {applicantId?.username
                            ?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{applicantId?.username
                            || 'Unknown'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{jobId?.title}</p>
                    </div>
                </div>
                <Badge variant={getScoreBadgeVariant(aiScore || 0)}>
                    {aiScore >= 70 ? 'High' : aiScore >= 40 ? 'Medium' : 'Low'}
                </Badge>
            </div>

            <div className="mt-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">AI Match Score</span>
                    <span className={cn("font-semibold", getScoreColor(aiScore || 0))}>
                        {aiScore || 0}%
                    </span>
                </div>
                <ProgressBar value={aiScore || 0} max={100} className="mt-1 h-1.5" />
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Applied: {new Date(createdAt).toLocaleDateString()}</span>
                <Badge variant="gray" size="sm">{status || 'Pending'}</Badge>
            </div>

            <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    Contact
                </Button>
            </div>
        </Card>
    );
};