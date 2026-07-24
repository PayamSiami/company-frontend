import  { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../common/UI/Card';
import { ChevronLeft, Eye, FileText, Plus } from 'lucide-react';
import { Badge, Button, ProgressBar } from '../common/Index';
import { selectApplications, selectApplicationsLoading } from '../../store/slices/applications.slice';
import { useSelector } from 'react-redux';
import TableSkeleton from '../ui/TableSkeleton';
import { cn } from '../../lib/utils';
import { formatDate } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { StatusUpdateModal } from './StatusUpdateModal';

const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'warning' | 'info' | 'success' | 'danger', label: string }> = {
        pending: { variant: 'warning', label: 'در انتظار' },
        reviewing: { variant: 'info', label: 'در حال بررسی' },
        shortlisted: { variant: 'success', label: 'انتخاب شده' },
        rejected: { variant: 'danger', label: 'رد شده' },
    };
    return config[status] || config.pending;
};

const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
};


export default function RecentApplications() {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const applications = useSelector(selectApplications);
    const applicationsLoading = useSelector(selectApplicationsLoading);
    const [selectedApplication, setSelectedApplication] = useState<any>({ id: null, status: null });

    return (
        <>
            <div className="grid grid-cols-1 gap-6">
                {/* Recent Applications Table */}
                <div className="lg:col-span-2">
                    <Card className="border-gray-200/50 dark:border-gray-800/50 h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    درخواست‌های اخیر
                                </CardTitle>
                                <CardDescription>آخرین درخواست‌های داوطلبان</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link to="/applications">
                                    <Button variant="ghost" size="sm" className="gap-1 text-gray-600 dark:text-gray-400">
                                        مشاهده همه
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {applicationsLoading && applications?.length === 0 ? (
                                <TableSkeleton />
                            ) : applications?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    داوطلب
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    موقعیت شغلی
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    وضعیت
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    امتیاز AI
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    تاریخ درخواست
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    عملیات
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {applications.slice(0, 5).map((app: any) => {
                                                const statusConfig = getStatusBadge(app.status);
                                                return (
                                                    <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                                                    {app?.resumeId?.personalInfo?.firstName?.charAt(0) || '?'}
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {app?.resumeId?.personalInfo?.firstName + ' ' + app?.resumeId?.personalInfo?.lastName || 'ناشناس'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-start text-sm text-gray-600 dark:text-gray-300">
                                                            {app?.jobId?.title || 'نامشخص'}
                                                        </td>
                                                        <td className="px-4 py-3 text-start text-sm text-gray-600 dark:text-gray-300">
                                                            <Badge variant={statusConfig.variant} size="sm">
                                                                {statusConfig.label}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-start text-sm text-gray-600 dark:text-gray-300">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn("text-sm font-semibold", getScoreColor(app.aiScore || 0))}>
                                                                    {app.aiScore || 0}%
                                                                </span>
                                                                <ProgressBar
                                                                    value={app.aiScore || 0}
                                                                    max={100}
                                                                    className="w-12 h-1.5"
                                                                    color={app.aiScore >= 70 ? 'green' : app.aiScore >= 40 ? 'yellow' : 'red'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(app.createdAt)}
                                                        </td>
                                                        <td className="px-4 py-3 text-left" onClick={() => {
                                                            setSelectedApplication(app);
                                                            setShowStatusModal(true);
                                                        }}>
                                                            <Button variant="outline" size="sm" className="h-8 cursor-pointer w-8 p-0 flex items-center justify-center rounded-md border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                                <Eye className="w-4 h-4 text-gray-400" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">هنوز درخواستی وجود ندارد</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">با ثبت اولین آگهی شغلی، دریافت درخواست‌ها را شروع کنید</p>
                                    <Link to="/jobs/create">
                                        <Button variant="outline" size="sm" className="mt-4">
                                            <Plus className="w-4 h-4 ml-2" />
                                            ثبت اولین آگهی شغلی
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div >
            {selectedApplication && showStatusModal && (
                <StatusUpdateModal
                    applicationId={selectedApplication._id}
                    currentStatus={selectedApplication.status}
                    onClose={() => setShowStatusModal(false)}
                />
            )}
        </>

    )
}
