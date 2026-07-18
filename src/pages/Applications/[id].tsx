// frontend-company/src/pages/Applications/[id].tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import {
    fetchApplicationById,
    updateApplicationStatus
} from '../../store/slices/applications.slice';
import { ApplicationDetail } from '../../components/applications/ApplicationDetail';
import { StatusUpdateModal } from '../../components/applications/StatusUpdateModal';
import { Button } from '../../components/common/UI/Button';
import { Badge } from '../../components/common/UI/Badge';
import {
    ArrowLeft,
    Download,
    Share2,
    Mail,
    Calendar,
    FileText,
    Users,
    Sparkles,
    MoreVertical,
    Edit,
    Trash2,
    Copy,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../components/common/UI/DropdownMenu';
import { toast } from 'sonner';

const ApplicationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedApplication, isLoading, isUpdating } = useSelector(
        (state: RootState) => state.applications
    );

    const [showStatusModal, setShowStatusModal] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchApplicationById(id));
        }
    }, [dispatch, id]);

    const handleStatusUpdate = async (status: string, notes?: string, interviewDetails?: any) => {
        if (id) {
            await dispatch(updateApplicationStatus({
                id,
                data: { status, notes, ...(interviewDetails && { interviewDetails }) }
            }));
            setShowStatusModal(false);
            toast.success('Application status updated successfully!');
        }
    };

    const handleBack = () => {
        navigate('/applications');
    };

    const handleDownloadResume = () => {
        // Download resume logic
        toast.success('Resume downloaded successfully!');
    };

    const handleShare = () => {
        // Share application logic
        toast.success('Application link copied to clipboard!');
    };

    if (isLoading && !selectedApplication) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Loading application details...</p>
            </div>
        );
    }

    if (!selectedApplication) {
        return (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application not found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    The application you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={handleBack} className="mt-4 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Applications
                </Button>
            </div>
        );
    }

    const getStatusBadgeVariant = (status: string) => {
        const variants: Record<string, any> = {
            'PENDING': 'warning',
            'REVIEWING': 'info',
            'SHORTLISTED': 'success',
            'REJECTED': 'danger',
            'INTERVIEW_SCHEDULED': 'purple',
            'HIRED': 'emerald',
        };
        return variants[status] || 'gray';
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedApplication?.userId?.username || 'Unknown Candidate'}
                        </h1>
                        <Badge variant={getStatusBadgeVariant(selectedApplication.status)}>
                            {selectedApplication.status?.replace('_', ' ')}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* AI Score */}
                    {selectedApplication.aiScore !== undefined && selectedApplication.aiScore !== null && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {selectedApplication.aiScore}%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">AI Score</span>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadResume}
                        className="gap-1.5"
                    >
                        <Download className="w-4 h-4" />
                        Resume
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="gap-1.5"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowStatusModal(true)}
                        disabled={isUpdating}
                        className="gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        <Edit className="w-4 h-4" />
                        Update Status
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="gap-2">
                                <Mail className="w-4 h-4" />
                                Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <Calendar className="w-4 h-4" />
                                Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <Copy className="w-4 h-4" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600">
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Quick Actions Banner */}
            <div className="flex flex-wrap items-center gap-2 p-4 bg-linear-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Quick Actions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Mail className="w-4 h-4" />
                        Contact
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Interview
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <FileText className="w-4 h-4" />
                        Notes
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Users className="w-4 h-4" />
                        Feedback
                    </Button>
                </div>
            </div>

            {/* Application Detail */}
            <ApplicationDetail application={selectedApplication} />

            {/* Status Update Modal */}
            {showStatusModal && (
                <StatusUpdateModal
                    applicationId={selectedApplication._id}
                    currentStatus={selectedApplication.status}
                    onClose={() => setShowStatusModal(false)}
                    onUpdate={handleStatusUpdate}
                    isLoading={isUpdating}
                    // candidateName={selectedApplication?.userId?.username}
                    // jobTitle={selectedApplication?.jobId.title}
                />
            )}
        </div>
    );
};

export default ApplicationDetailPage;