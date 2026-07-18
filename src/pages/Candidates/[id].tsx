// frontend-company/src/pages/Candidates/[id].tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';
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
    ArrowLeft,
    Star,
    Mail,
    Calendar,
    Download,
    Share2,
    MoreVertical,
    Trash2,
    Copy,
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
                toast.info('Candidate removed from shortlist');
            } else {
                await dispatch(shortlistCandidate(id));
                toast.success('Candidate shortlisted!');
            }
        }
    };

    const handleBack = () => {
        navigate('/candidates');
    };

    const handleContact = () => {
        toast.success('Contact form opened');
    };

    const handleDownloadResume = () => {
        toast.success('Resume downloaded!');
    };

    const handleShare = () => {
        toast.success('Profile link copied to clipboard!');
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            pending: { color: 'bg-yellow-500', label: 'Pending' },
            reviewed: { color: 'bg-blue-500', label: 'Reviewed' },
            shortlisted: { color: 'bg-green-500', label: 'Shortlisted' },
            interviewing: { color: 'bg-purple-500', label: 'Interviewing' },
            hired: { color: 'bg-emerald-500', label: 'Hired' },
            rejected: { color: 'bg-red-500', label: 'Rejected' },
        };
        return statusMap[status] || { color: 'bg-gray-500', label: status || 'Unknown' };
    };

    const getAIRecommendationBadge = (recommendation?: string) => {
        const map: Record<string, { color: string; label: string }> = {
            consider: { color: 'bg-blue-100 text-blue-700', label: 'Consider' },
            interview: { color: 'bg-purple-100 text-purple-700', label: 'Interview' },
            shortlist: { color: 'bg-green-100 text-green-700', label: 'Shortlist' },
            reject: { color: 'bg-red-100 text-red-700', label: 'Reject' },
        };
        return map[recommendation || ''] || { color: 'bg-gray-100 text-gray-700', label: 'N/A' };
    };

    const formatDate = (date: string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading && !selectedCandidate) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Loading candidate profile...</p>
            </div>
        );
    }

    if (!selectedCandidate) {
        return (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Users className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Candidate not found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    The candidate you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={handleBack} className="mt-4 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Candidates
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
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="gap-1.5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {personalInfo?.firstName} {personalInfo?.lastName}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {personalInfo?.title} • {data.job?.title || 'No job'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge className={statusBadge.color}>
                        {statusBadge.label}
                    </Badge>
                    <Badge className={aiRecommendation.color}>
                        AI: {aiRecommendation.label}
                    </Badge>
                    <Button
                        variant={isShortlisted ? 'success' : 'outline'}
                        size="sm"
                        onClick={handleShortlistToggle}
                        className={cn(
                            "gap-1.5",
                            isShortlisted && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        )}
                    >
                        <Star className={cn("w-4 h-4", isShortlisted && "fill-current")} />
                        {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleContact}
                        className="gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        <Mail className="w-4 h-4" />
                        Contact
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="gap-2" onClick={handleDownloadResume}>
                                <Download className="w-4 h-4" />
                                Download Resume
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={handleShare}>
                                <Share2 className="w-4 h-4" />
                                Share Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <Calendar className="w-4 h-4" />
                                Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600">
                                <Trash2 className="w-4 h-4" />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Skills</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {resume?.skills?.length || 0}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">total skills</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {resume?.experience?.length || 0}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">roles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Education</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {resume?.education?.length || 0}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">degrees</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">AI Score</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {data.score || 0}%
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">match score</p>
                    </CardContent>
                </Card>
            </div>

            {/* Candidate Info Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Contact Information</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-400">{personalInfo?.email || data.user?.email}</span>
                                </div>
                                {personalInfo?.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{personalInfo.phone}</span>
                                    </div>
                                )}
                                {personalInfo?.location && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{personalInfo.location}</span>
                                    </div>
                                )}
                                {personalInfo?.linkedin && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-400">LinkedIn</span>
                                        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {personalInfo.linkedin}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Application Details</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-400">Applied for: <strong>{data.job?.title}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-400">Applied on: {formatDate(data.appliedDate)}</span>
                                </div>
                                {data.expectedSalary && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Award className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">Expected Salary: ${data.expectedSalary.toLocaleString()}</span>
                                    </div>
                                )}
                                {data.coverLetter && (
                                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <strong>Cover Letter:</strong> {data.coverLetter}
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
                            AI Analysis
                        </CardTitle>
                        <CardDescription>AI-powered candidate assessment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.aiStrengths?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Strengths</h4>
                                    <ul className="space-y-1">
                                        {data.aiStrengths.map((strength, index) => (
                                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="text-green-500">✓</span>
                                                {strength}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {data.aiWeaknesses?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Areas for Improvement</h4>
                                    <ul className="space-y-1">
                                        {data.aiWeaknesses.map((weakness, index) => (
                                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="text-red-500">✗</span>
                                                {weakness}
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
                <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex flex-wrap">
                    <TabsTrigger
                        value="profile"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
                    >
                        <Users className="w-4 h-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger
                        value="resume"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
                    >
                        <FileText className="w-4 h-4" />
                        Resume
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