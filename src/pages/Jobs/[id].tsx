// frontend-company/src/pages/Jobs/[id].tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
    fetchJobById,
    deleteJob,
    publishJob,
    closeJob
} from '../../store/slices/jobs.slice';
import { Button } from '../../components/common/UI/Button';
import { Badge } from '../../components/common/UI/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/UI/Card';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Send,
    XCircle,
    Copy,
    MapPin,
    DollarSign,
    Users,
    Clock,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle,
    AlertCircle,
    MoreVertical,
    Share2,
    Download,
    Printer,
    Star,
    FileText,
    List,
    Info,
    Lightbulb,
    Award,
    Tag,
    Eye,
    EyeOff,
    TrendingUp,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../components/common/UI/DropdownMenu';
import { toast } from 'sonner';
import { useAppDispatch } from '../../store/hooks';

const JobDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedJob, isLoading }: any = useSelector((state: RootState) => state.jobs);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchJobById(id));
        }
    }, [dispatch, id]);

    const handlePublish = async () => {
        if (id) {
            try {
                await dispatch(publishJob(id)).unwrap();
                toast.success('شغل با موفقیت منتشر شد!');
            } catch (error) {
                toast.error('انتشار شغل با شکست مواجه شد');
            }
        }
    };

    const handleClose = async () => {
        if (id) {
            try {
                await dispatch(closeJob(id)).unwrap();
                toast.success('شغل با موفقیت بسته شد!');
            } catch (error) {
                toast.error('بستن شغل با شکست مواجه شد');
            }
        }
    };

    const handleDelete = async () => {
        if (id) {
            try {
                await dispatch(deleteJob(id)).unwrap();
                toast.success('شغل با موفقیت حذف شد!');
                navigate('/jobs');
            } catch (error) {
                toast.error('حذف شغل با شکست مواجه شد');
            }
        }
    };

    const handleDuplicate = () => {
        toast.success('شغل کپی شد!');
        navigate('/jobs/create');
    };

    const handleBack = () => {
        navigate('/jobs');
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { label: string; variant: 'success' | 'gray' | 'danger' | 'warning' | 'info'; icon: any }> = {
            open: { label: 'فعال', variant: 'success', icon: CheckCircle },
            active: { label: 'فعال', variant: 'success', icon: CheckCircle },
            draft: { label: 'پیش‌نویس', variant: 'gray', icon: Clock },
            closed: { label: 'بسته شده', variant: 'gray', icon: XCircle },
            expired: { label: 'منقضی شده', variant: 'danger', icon: AlertCircle },
            filled: { label: 'تکمیل شده', variant: 'success', icon: CheckCircle },
            paused: { label: 'متوقف شده', variant: 'warning', icon: EyeOff },
        };
        return configs[status?.toLowerCase()] || configs.draft;
    };

    const getJobTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'full-time': 'تمام وقت',
            'part-time': 'پاره وقت',
            contract: 'قراردادی',
            internship: 'کارآموزی',
            freelance: 'آزاد',
            remote: 'دورکاری',
        };
        return types[type] || type || 'نامشخص';
    };

    const getExperienceLevelLabel = (level: string) => {
        const levels: Record<string, string> = {
            entry: 'مبتدی',
            mid: 'متوسط',
            senior: 'ارشد',
            lead: 'رهبر تیم / مدیر',
        };
        return levels[level] || level || 'نامشخص';
    };

    const getWorkModeLabel = (mode: string) => {
        const modes: Record<string, string> = {
            remote: 'دورکاری',
            hybrid: 'ترکیبی',
            'on-site': 'حضوری',
        };
        return modes[mode] || mode || 'نامشخص';
    };

    const formatDate = (date: string) => {
        if (!date) return 'نامشخص';
        return new Date(date).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        if (!amount) return 'نامشخص';
        return new Intl.NumberFormat('fa-IR', {
            style: 'currency',
            currency: 'IRR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading && !selectedJob) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4" dir="rtl">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری جزئیات شغل...</p>
            </div>
        );
    }

    if (!selectedJob) {
        return (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50" dir="rtl">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Briefcase className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">شغل یافت نشد</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    شغلی که به دنبال آن هستید وجود ندارد یا حذف شده است.
                </p>
                <Button onClick={handleBack} className="mt-4 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    بازگشت به مشاغل
                </Button>
            </div>
        );
    }

    const statusConfig = getStatusConfig(selectedJob.status || selectedJob.isActive ? 'active' : 'closed');
    const StatusIcon = statusConfig.icon;

    return (
        <div className="space-y-6" dir="rtl">
            {/* Page Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedJob.title}
                            </h1>
                            <Badge variant={statusConfig.variant} className="flex items-center gap-1.5">
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusConfig.label}
                            </Badge>
                            {selectedJob.isActive === false && selectedJob?.status !== 'draft' && (
                                <Badge variant="gray" className="flex items-center gap-1.5">
                                    <EyeOff className="w-3.5 h-3.5" />
                                    غیرفعال
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {selectedJob.company || 'شرکت نامشخص'}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {selectedJob.location || 'موقعیت مشخص نشده'}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                ثبت شده در {formatDate(selectedJob.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* View Count */}
                    {selectedJob.views !== undefined && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedJob.views}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">بازدید</span>
                        </div>
                    )}

                    {/* Applications Count */}
                    {selectedJob.applicationCount !== undefined && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedJob.applicationCount}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">درخواست</span>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/jobs/${id}/edit`)}
                        className="gap-1.5"
                    >
                        <Edit className="w-4 h-4" />
                        ویرایش
                    </Button>

                    {selectedJob?.status === 'draft' && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handlePublish}
                            className="gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Send className="w-4 h-4" />
                            انتشار
                        </Button>
                    )}

                    {(selectedJob?.status === 'open' || selectedJob?.status === 'active') && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClose}
                            className="gap-1.5 text-yellow-600 hover:text-yellow-700 border-yellow-200 hover:border-yellow-300"
                        >
                            <XCircle className="w-4 h-4" />
                            بستن
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={handleDuplicate} className="gap-2">
                                <Copy className="w-4 h-4" />
                                کپی کردن
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <Share2 className="w-4 h-4" />
                                اشتراک‌گذاری
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <Download className="w-4 h-4" />
                                دانلود PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <Printer className="w-4 h-4" />
                                چاپ
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-2 text-red-600"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash2 className="w-4 h-4" />
                                حذف
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">نوع شغل</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {getJobTypeLabel(selectedJob.jobType)}
                                </p>
                            </div>
                            <Briefcase className="w-5 h-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">سطح تجربه</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {getExperienceLevelLabel(selectedJob.experienceLevel)}
                                </p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">نوع همکاری</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {getWorkModeLabel(selectedJob.workMode)}
                                </p>
                            </div>
                            <MapPin className="w-5 h-5 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">تعداد موقعیت</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {selectedJob.openings || 1}
                                </p>
                            </div>
                            <Users className="w-5 h-5 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                شرح شغل
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-right">
                                {selectedJob.description || 'شرحی ارائه نشده است.'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    {selectedJob.requirements && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <List className="w-4 h-4 text-gray-400" />
                                    الزامات
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {selectedJob.requirements
                                        .split('\n')
                                        .filter((reqLine: string) => reqLine.trim())
                                        .map((reqLine: string, index: number) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                                                <span className="text-gray-700 dark:text-gray-300 text-right">
                                                    {reqLine.replace(/^[•\-\s*]+/, '').trim()}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Responsibilities */}
                    {selectedJob.responsibilities && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-gray-400" />
                                    مسئولیت‌ها
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {selectedJob.responsibilities
                                        .split('\n')
                                        .filter((respLine: string) => respLine.trim())
                                        .map((respLine: string, index: number) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <span className="text-purple-500 mt-0.5 shrink-0">•</span>
                                                <span className="text-gray-700 dark:text-gray-300 text-right">
                                                    {respLine.replace(/^[•\-\s*]+/, '').trim()}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Benefits */}
                    {selectedJob.benefits && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Award className="w-4 h-4 text-gray-400" />
                                    مزایا
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {selectedJob.benefits
                                        .split('\n')
                                        .filter((benefitLine: string) => benefitLine.trim())
                                        .map((benefitLine: string, index: number) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                                                <span className="text-gray-700 dark:text-gray-300 text-right">
                                                    {benefitLine.replace(/^[•\-\s*]+/, '').trim()}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Job Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Info className="w-4 h-4 text-gray-400" />
                                اطلاعات شغل
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">نوع شغل</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {getJobTypeLabel(selectedJob.jobType)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">نوع همکاری</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {getWorkModeLabel(selectedJob.workMode)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">سطح تجربه</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {getExperienceLevelLabel(selectedJob.experienceLevel)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">تعداد موقعیت</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {selectedJob.openings || 1}
                                </span>
                            </div>
                            {selectedJob.applicationDeadline && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">مهلت ثبت</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(selectedJob?.applicationDeadline)}
                                    </span>
                                </div>
                            )}
                            {selectedJob.expiresAt && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">انقضا</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(selectedJob?.expiresAt)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500 dark:text-gray-400">تاریخ ایجاد</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatDate(selectedJob?.createdAt)}
                                </span>
                            </div>
                            {selectedJob.updatedAt && selectedJob.updatedAt !== selectedJob.createdAt && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">آخرین بروزرسانی</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(selectedJob?.updatedAt)}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Salary Card */}
                    {(selectedJob.minSalary || selectedJob.maxSalary) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    محدوده حقوق
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(selectedJob.minSalary || 0)} - {formatCurrency(selectedJob.maxSalary || 0)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    محدوده حقوق سالانه
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills Card */}
                    {selectedJob.skills && selectedJob.skills.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Star className="w-4 h-4 text-gray-400" />
                                    مهارت‌ها
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedJob.skills.map((skill: string, index: number) => (
                                        <Badge key={index} variant="gray" size="sm" className="text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tags Card */}
                    {selectedJob.tags && selectedJob.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-gray-400" />
                                    برچسب‌ها
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedJob.tags.map((tag: string, index: number) => (
                                        <Badge key={index} variant="info" size="sm" className="text-xs">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">حذف شغل</h3>
                        </div>
                        <p className="text-right text-gray-600 dark:text-gray-400 mb-4">
                            آیا مطمئن هستید که می‌خواهید "<span className="font-medium text-gray-900 dark:text-white">{selectedJob.title}</span>" را حذف کنید؟
                            این عمل قابل بازگشت نیست. تمام درخواست‌های مرتبط با این شغل نیز حذف خواهند شد.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                انصراف
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                حذف شغل
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetailPage;