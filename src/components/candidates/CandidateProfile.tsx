// frontend-company/src/components/candidates/CandidateProfile.tsx
import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Star,
    CheckCircle,
    XCircle,
    AlertCircle,
    Award,
    Clock,
    Link2,
    FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../common/UI/Card';
import { Badge } from '../common/UI/Badge';
import { Button } from '../common/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../common/UI/Tabs';
import { cn } from '../../lib/utils';
import { formatDate } from '../../utils/utils';

interface Skill {
    _id?: string;
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Experience {
    _id?: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
}

interface Education {
    _id?: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
}

interface Certification {
    _id?: string;
    name: string;
    issuer: string;
    date: string;
}

interface Language {
    _id?: string;
    name: string;
    proficiency: string;
}

interface Project {
    _id?: string;
    name: string;
    description?: string;
    link?: string;
}

interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    title?: string;
    summary?: string;
    website?: string;
    linkedin?: string;
    github?: string;
}

interface ResumeData {
    _id: string;
    title: string;
    isDefault: boolean;
    template: string;
    visibility: string;
    status: string;
    personalInfo?: PersonalInfo;
    skills: Skill[];
    experience: Experience[];
    education: Education[];
    certifications: Certification[];
    languages: Language[];
    projects: Project[];
    customSections: any[];
    createdAt: string;
    updatedAt: string;
}

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
    resume: ResumeData;
    coverLetter?: string;
    expectedSalary?: number;
    aiRecommendation?: string;
    aiStrengths: string[];
    aiWeaknesses: string[];
}

interface CandidateProfileProps {
    candidate: CandidateData;
    onShortlistToggle?: () => void;
    isShortlisted?: boolean;
}

export const CandidateProfile: React.FC<CandidateProfileProps> = ({
    candidate,
    onShortlistToggle,
    isShortlisted = false
}) => {
    const [activeTab, setActiveTab] = useState('overview');

    const resume = candidate.resume;
    const personalInfo = resume?.personalInfo;
    const skills = resume?.skills || [];
    const experience = resume?.experience || [];
    const education = resume?.education || [];
    const certifications = resume?.certifications || [];
    const languages = resume?.languages || [];
    const projects = resume?.projects || [];

    const calculateExperience = (startDate: string, endDate?: string) => {
        if (!startDate) return 0;
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
        return diffYears;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'warning',
            reviewed: 'info',
            shortlisted: 'success',
            interviewing: 'info',
            hired: 'success',
            rejected: 'danger',
            ACTIVE: 'success',
            INACTIVE: 'gray',
            BLACKLISTED: 'danger'
        };
        return colors[status] || 'gray';
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, React.ElementType> = {
            pending: Clock,
            reviewed: CheckCircle,
            shortlisted: Star,
            interviewing: Clock,
            hired: CheckCircle,
            rejected: XCircle,
            ACTIVE: CheckCircle,
            INACTIVE: AlertCircle,
            BLACKLISTED: XCircle
        };
        return icons[status] || AlertCircle;
    };

    const getLevelColor = (level?: string) => {
        const colors: Record<string, string> = {
            beginner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            expert: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        };
        return colors[level || ''] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    };

    const getLevelLabel = (level?: string) => {
        const labels: Record<string, string> = {
            beginner: 'مبتدی',
            intermediate: 'متوسط',
            advanced: 'پیشرفته',
            expert: 'متخصص',
        };
        return labels[level || ''] || level || '';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'در انتظار',
            reviewed: 'بررسی شده',
            shortlisted: 'انتخاب شده',
            interviewing: 'در حال مصاحبه',
            hired: 'استخدام شده',
            rejected: 'رد شده',
            ACTIVE: 'فعال',
            INACTIVE: 'غیرفعال',
            BLACKLISTED: 'لیست سیاه'
        };
        return labels[status] || status || 'نامشخص';
    };

    const getAIRecommendationLabel = (recommendation?: string) => {
        const labels: Record<string, string> = {
            consider: 'مورد توجه',
            interview: 'مصاحبه',
            shortlist: 'انتخاب',
            reject: 'رد'
        };
        return labels[recommendation || ''] || recommendation || '';
    };

    const StatusIcon = getStatusIcon(candidate.status);
    const statusColor = getStatusColor(candidate.status);

    const totalExperience = experience.reduce((total, exp) => {
        return total + calculateExperience(exp.startDate, exp.endDate);
    }, 0);

    return (
        <div className="space-y-6" dir="rtl">
            {/* Profile Header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/25">
                                {personalInfo?.firstName?.charAt(0) ||
                                    candidate.user?.fullName?.charAt(0) ||
                                    'U'}
                            </div>
                            {isShortlisted && (
                                <div className="absolute -top-1 -right-1">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                                        <Star className="w-3.5 h-3.5 text-white fill-current" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {personalInfo?.firstName} {personalInfo?.lastName}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {personalInfo?.title || 'داوطلب'}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {personalInfo?.email || candidate.user?.email}
                                        </span>
                                        {personalInfo?.phone && (
                                            <>
                                                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    {personalInfo.phone}
                                                </span>
                                            </>
                                        )}
                                        {personalInfo?.location && (
                                            <>
                                                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {personalInfo.location}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Badge variant={statusColor as any} className="flex items-center gap-1.5">
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {getStatusLabel(candidate.status)}
                                    </Badge>
                                    {candidate.aiRecommendation && (
                                        <Badge
                                            className={cn(
                                                "flex items-center gap-1.5",
                                                candidate.aiRecommendation === 'consider' && 'bg-blue-100 text-blue-700',
                                                candidate.aiRecommendation === 'interview' && 'bg-purple-100 text-purple-700',
                                                candidate.aiRecommendation === 'shortlist' && 'bg-green-100 text-green-700',
                                                candidate.aiRecommendation === 'reject' && 'bg-red-100 text-red-700'
                                            )}
                                        >
                                            <Award className="w-3.5 h-3.5" />
                                            AI: {getAIRecommendationLabel(candidate.aiRecommendation)}
                                        </Badge>
                                    )}
                                    {onShortlistToggle && (
                                        <Button
                                            variant={isShortlisted ? 'success' : 'outline'}
                                            size="sm"
                                            onClick={onShortlistToggle}
                                            className="gap-1.5"
                                        >
                                            <Star className={cn("w-4 h-4", isShortlisted && "fill-current")} />
                                            {isShortlisted ? 'انتخاب شده' : 'انتخاب'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">کل سابقه کاری</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {totalExperience} سال
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">مهارت‌ها</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {skills.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">امتیاز هوش مصنوعی</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                            {candidate.score || 0}%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">تاریخ ثبت</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {formatDate(candidate.appliedDate)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1 flex flex-wrap">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        نمای کلی
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        سابقه کاری
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        تحصیلات
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        مهارت‌ها
                    </TabsTrigger>
                    <TabsTrigger value="certifications" className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        گواهینامه‌ها
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        پروژه‌ها
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    {/* Summary */}
                    {personalInfo?.summary && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">خلاصه حرفه‌ای</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-right">
                                    {personalInfo.summary}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">مهارت‌ها</CardTitle>
                            <CardDescription>مهارت‌های برتر و سطح تسلط</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {skills.slice(0, 10).map((skill, index) => (
                                    <Badge
                                        key={skill._id || index}
                                        className={cn(
                                            "text-sm px-3 py-1.5",
                                            getLevelColor(skill.level)
                                        )}
                                    >
                                        {skill.name}
                                        {skill.level && (
                                            <span className="mr-1.5 text-xs opacity-70">
                                                ({getLevelLabel(skill.level)})
                                            </span>
                                        )}
                                    </Badge>
                                ))}
                                {skills.length === 0 && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">هیچ مهارتی ذکر نشده است</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">خلاصه سابقه کاری</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {experience.slice(0, 2).map((exp, index) => (
                                        <div key={exp._id || index} className="flex items-start gap-3">
                                            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                                <Briefcase className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white text-right">
                                                    {exp.position}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                                    {exp.company} • {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'تاکنون'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {experience.length > 2 && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
                                            +{experience.length - 2} سابقه کاری دیگر
                                        </p>
                                    )}
                                    {experience.length === 0 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-right">هیچ سابقه کاری ذکر نشده است</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">تحصیلات</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {education.slice(0, 2).map((edu, index) => (
                                        <div key={edu._id || index} className="flex items-start gap-3">
                                            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                                <GraduationCap className="w-4 h-4 text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white text-right">
                                                    {edu.degree} {edu.fieldOfStudy ? `در ${edu.fieldOfStudy}` : ''}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                                    {edu.institution} • {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'تاکنون'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {education.length > 2 && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
                                            +{education.length - 2} تحصیلات دیگر
                                        </p>
                                    )}
                                    {education.length === 0 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-right">هیچ تحصیلاتی ذکر نشده است</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Languages */}
                    {languages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">زبان‌ها</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((lang, index) => (
                                        <Badge key={lang._id || index} className="text-sm">
                                            {lang.name} - {lang.proficiency}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">سابقه کاری</CardTitle>
                            <CardDescription>تاریخچه سابقه حرفه‌ای</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {experience.length > 0 ? (
                                <div className="relative space-y-6">
                                    <div className="absolute right-5 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />
                                    {experience.map((exp, index) => (
                                        <div key={exp._id || index} className="relative pr-12">
                                            <div className="absolute right-0 top-1 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                                {exp.company?.charAt(0) || 'W'}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white text-right">
                                                    {exp.position}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 text-right">{exp.company}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'تاکنون'}
                                                    <span className="mr-2 text-gray-400">
                                                        ({calculateExperience(exp.startDate, exp.endDate)} سال)
                                                    </span>
                                                </p>
                                                {exp.description && (
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-right">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-right">هیچ سابقه کاری ذکر نشده است</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">تحصیلات</CardTitle>
                            <CardDescription>پیشینه تحصیلی</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {education.length > 0 ? (
                                <div className="relative space-y-6">
                                    <div className="absolute right-5 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />
                                    {education.map((edu, index) => (
                                        <div key={edu._id || index} className="relative pr-12">
                                            <div className="absolute right-0 top-1 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                                                {edu.institution?.charAt(0) || 'E'}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white text-right">
                                                    {edu.degree} {edu.fieldOfStudy ? `در ${edu.fieldOfStudy}` : ''}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 text-right">{edu.institution}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'تاکنون'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-right">هیچ تحصیلاتی ذکر نشده است</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">مهارت‌ها و تخصص‌ها</CardTitle>
                            <CardDescription>مهارت‌های فنی و حرفه‌ای</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <Badge
                                            key={skill._id || index}
                                            className={cn(
                                                "text-sm px-4 py-2",
                                                getLevelColor(skill.level)
                                            )}
                                        >
                                            {skill.name}
                                            {skill.level && (
                                                <span className="mr-1.5 text-xs opacity-70">
                                                    ({getLevelLabel(skill.level)})
                                                </span>
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-right">هیچ مهارتی ذکر نشده است</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Certifications Tab */}
                <TabsContent value="certifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">گواهینامه‌ها</CardTitle>
                            <CardDescription>گواهینامه‌های حرفه‌ای و مدارک</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {certifications.length > 0 ? (
                                <div className="space-y-3">
                                    {certifications.map((cert, index) => (
                                        <div key={cert._id || index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                                <Award className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white text-right">
                                                    {cert.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                                    {cert.issuer} • {formatDate(cert.date)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-right">هیچ گواهینامه‌ای ذکر نشده است</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">پروژه‌ها</CardTitle>
                            <CardDescription>نمونه کارها و پروژه‌ها</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {projects.length > 0 ? (
                                <div className="space-y-4">
                                    {projects.map((project, index) => (
                                        <div key={project._id || index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2 text-right">
                                                {project.name}
                                                {project.link && (
                                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                                                        <Link2 className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </h4>
                                            {project.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-right">هیچ پروژه‌ای ذکر نشده است</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CandidateProfile;