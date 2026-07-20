// frontend-company/src/pages/Candidates/[id].tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
    fetchCandidateById,
    shortlistCandidate,
    unshortlistCandidate,
    fetchCandidateApplications,
    fetchCandidateResume
} from '../../store/slices/candidates.slice';
import { CandidateProfile } from '../../components/candidates/CandidateProfile';
import { Button } from '../../components/common/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/UI/Tabs';
import {
    ArrowRight,
    Star,
    Mail,
    Calendar,
    Download,
    Share2,
    MoreVertical,
    Trash2,
    Users,
    FileText,
    Briefcase,
    MapPin,
    Phone,
    Award,
    Clock,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../components/common/UI/DropdownMenu';
import { toast } from 'sonner';
import { useAppDispatch } from '../../store/hooks';
import CandidateResume from '../../components/candidates/CandidateResume';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/UI/Card';
import { Badge } from '../../components/common/UI/Badge';

// Types based on API response
interface CandidateData {
    _id: string;
    user: {
        _id: string;
        email: string;
        fullName?: string;
    };
    job: {
        _id: string;
        title: string;
        company: string;
    };
    status: string;
    appliedDate: string;
    score: number;
    resume: {
        _id: string;
        user: string;
        title: string;
        isDefault: boolean;
        template: string;
        visibility: string;
        status: string;
        personalInfo: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            location: string;
            title: string;
            summary: string;
            website?: string;
            linkedin?: string;
            github?: string;
        };
        skills: Array<{
            _id: string;
            name: string;
            level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
        }>;
        experience: Array<{
            _id?: string;
            company: string;
            position: string;
            startDate: string;
            endDate?: string;
            description?: string;
        }>;
        education: Array<{
            _id?: string;
            institution: string;
            degree: string;
            fieldOfStudy?: string;
            startDate: string;
            endDate?: string;
        }>;
        certifications: Array<{
            _id?: string;
            name: string;
            issuer: string;
            date: string;
        }>;
        languages: Array<{
            _id?: string;
            name: string;
            proficiency: string;
        }>;
        projects: Array<{
            _id?: string;
            name: string;
            description?: string;
            link?: string;
        }>;
        customSections: Array<{
            _id?: string;
            title: string;
            content: string;
            order: number;
        }>;
        pdfFile?: {
            filename: string;
            path: string;
            size: number;
            mimeType: string;
            uploadedAt: string;
        };
        createdAt: string;
        updatedAt: string;
    };
    coverLetter?: string;
    expectedSalary?: number;
    aiRecommendation?: string;
    aiStrengths: string[];
    aiWeaknesses: string[];
}

const CandidateProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedCandidate, isLoading, shortlistedIds } = useSelector(
        (state: RootState) => state.candidates
    );

    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (id) {
            dispatch(fetchCandidateById(id));
            dispatch(fetchCandidateApplications(id));
            dispatch(fetchCandidateResume(id));
        }
    }, [dispatch, id]);

    const handleShortlistToggle = async () => {
        if (id) {
            if (shortlistedIds.includes(id)) {
                await dispatch(unshortlistCandidate(id));
                toast.info('کارجو از لیست منتخب حذف شد');
            } else {
                await dispatch(shortlistCandidate(id));
                toast.success('کارجو به لیست منتخب اضافه شد!');
            }
        }
    };

    const handleBack = () => {
        navigate('/candidates');
    };

    const handleContact = () => {
        toast.success('فرم ارتباط با کارجو باز شد');
    };

    const handleDownloadResume = () => {
        toast.success('رزومه با موفقیت دانلود شد!');
    };

    const handleShare = () => {
        toast.success('لینک پروفایل در حافظه موقت کپی شد!');
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            pending: { color: 'bg-yellow-500', label: 'در انتظار بررسی' },
            reviewed: { color: 'bg-blue-500', label: 'بررسی شده' },
            shortlisted: { color: 'bg-green-500', label: 'لیست منتخب' },
            interviewing: { color: 'bg-purple-500', label: 'در حال مصاحبه' },
            hired: { color: 'bg-emerald-500', label: 'استخدام شده' },
            rejected: { color: 'bg-red-500', label: 'رد شده' },
        };
        return statusMap[status] || { color: 'bg-gray-500', label: status || 'نامشخص' };
    };

    const getAIRecommendationBadge = (recommendation?: string) => {
        const map: Record<string, { color: string; label: string }> = {
            consider: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'قابل بررسی' },
            interview: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300', label: 'مصاحبه' },
            shortlist: { color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', label: 'لیست منتخب' },
            reject: { color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', label: 'عدم تایید' },
        };
        return map[recommendation || ''] || { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', label: 'بدون ارزیابی' };
    };

    const formatDate = (date: string) => {
        if (!date) return 'نامشخص';
        return new Date(date).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading && !selectedCandidate) {
        return (
            <div dir="rtl" className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">در حال بارگذاری پروفایل کارجو...</p>
            </div>
        );
    }

    if (!selectedCandidate) {
        return (
            <div dir="rtl" className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Users className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">کارجو یافت نشد</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    کارجویی که به دنبال آن هستید وجود ندارد یا حذف شده است.
                </p>
                <Button onClick={handleBack} className="mt-4 gap-2">
                    <ArrowRight className="h-4 w-4" />
                    بازگشت به کارجویان
                </Button>
            </div>
        );
    }

    // Extract data from the API response
    const data = selectedCandidate as unknown as CandidateData;
    const resume = data.resume;
    const personalInfo = resume?.personalInfo;
    const statusBadge = getStatusBadge(data.status);
    const aiRecommendation = getAIRecommendationBadge(data.aiRecommendation);

    const isShortlisted = shortlistedIds.includes(id || '');

    return (
        <div dir="rtl" className="space-y-6 text-right">
            {/* Page Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="gap-1.5"
                    >
                        <ArrowRight className="w-4 h-4" />
                        بازگشت
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {personalInfo?.firstName} {personalInfo?.lastName}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {personalInfo?.title} • {data.job?.title || 'بدون فرصت شغلی'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge className={statusBadge.color}>
                        {statusBadge.label}
                    </Badge>
                    <Badge className={aiRecommendation.color}>
                        هوش مصنوعی: {aiRecommendation.label}
                    </Badge>
                    <Button
                        variant={isShortlisted ? 'success' : 'outline'}
                        size="sm"
                        onClick={handleShortlistToggle}
                        className={cn(
                            "gap-1.5",
                            isShortlisted && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        )}
                    >
                        <Star className={cn("w-4 h-4", isShortlisted && "fill-current")} />
                        {isShortlisted ? 'لیست منتخب' : 'افزودن به منتخب'}
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleContact}
                        className="gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                        <Mail className="w-4 h-4" />
                        ارتباط با کارجو
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-right">
                            <DropdownMenuItem className="gap-2 justify-end" onClick={handleDownloadResume}>
                                <span>دانلود رزومه</span>
                                <Download className="w-4 h-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 justify-end" onClick={handleShare}>
                                <span>اشتراک‌گذاری پروفایل</span>
                                <Share2 className="w-4 h-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 justify-end">
                                <span>برنامه‌ریزی مصاحبه</span>
                                <Calendar className="w-4 h-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 justify-end text-red-600 dark:text-red-400">
                                <span>حذف کارجو</span>
                                <Trash2 className="w-4 h-4" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">مهارت‌ها</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {resume?.skills?.length || 0}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">کل مهارت‌های ثبت شده</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">سوابق کاری</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {resume?.experience?.length || 0}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">موقعیت شغلی</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">تحصیلات</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {resume?.education?.length || 0}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">مدرک تحصیلی</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">امتیاز تطابق هوش مصنوعی</p>
                        <p className="text-2xl font-bold text-purple-600 mt-1">
                            {data.score || 0}%
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">میزان همخوانی رزومه</p>
                    </CardContent>
                </Card>
            </div>

            {/* Candidate Info Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">اطلاعات تماس</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm justify-start">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-400 dir-ltr">{personalInfo?.email || data.user?.email}</span>
                                </div>
                                {personalInfo?.phone && (
                                    <div className="flex items-center gap-2 text-sm justify-start">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400 dir-ltr">{personalInfo.phone}</span>
                                    </div>
                                )}
                                {personalInfo?.location && (
                                    <div className="flex items-center gap-2 text-sm justify-start">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{personalInfo.location}</span>
                                    </div>
                                )}
                                {personalInfo?.linkedin && (
                                    <div className="flex items-center gap-2 text-sm justify-start">
                                        <span className="text-gray-400">لینکدین:</span>
                                        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dir-ltr text-left">
                                            {personalInfo.linkedin}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">جزئیات درخواست ارسالی</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm justify-start">
                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-400">فرصت شغلی: <strong className="text-gray-900 dark:text-white">{data.job?.title}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm justify-start">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-400">تاریخ ارسال درخواست: {formatDate(data.appliedDate)}</span>
                                </div>
                                {data.expectedSalary && (
                                    <div className="flex items-center gap-2 text-sm justify-start">
                                        <Award className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">حقوق پیشنهادی: {data.expectedSalary.toLocaleString()} دلار</span>
                                    </div>
                                )}
                                {data.coverLetter && (
                                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            <strong>نامه‌ همراه (Cover Letter):</strong> {data.coverLetter}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AI Analysis */}
            {(data.aiStrengths?.length > 0 || data.aiWeaknesses?.length > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-500" />
                            ارزیابی و تحلیل هوش مصنوعی
                        </CardTitle>
                        <CardDescription>بررسی هوشمند نقاط قوت و ابعاد قابل بهبود متقاضی</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.aiStrengths?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">نقاط قوت رزومه</h4>
                                    <ul className="space-y-1.5">
                                        {data.aiStrengths.map((strength, index) => (
                                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="text-green-500 font-bold">✓</span>
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {data.aiWeaknesses?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">ابعاد قابل بهبود / چالش‌ها</h4>
                                    <ul className="space-y-1.5">
                                        {data.aiWeaknesses.map((weakness, index) => (
                                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="text-red-500 font-bold">✗</span>
                                                <span>{weakness}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex flex-wrap gap-1">
                    <TabsTrigger
                        value="profile"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
                    >
                        <Users className="w-4 h-4" />
                        اطلاعات پروفایل
                    </TabsTrigger>
                    <TabsTrigger
                        value="resume"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
                    >
                        <FileText className="w-4 h-4" />
                        مشاهده رزومه
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-4">
                    <CandidateProfile candidate={data} />
                </TabsContent>
                <TabsContent value="resume" className="mt-4">
                    <CandidateResume
                        resumes={resume?.pdfFile ? [resume.pdfFile] : []}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CandidateProfilePage;