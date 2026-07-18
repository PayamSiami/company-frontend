// src/pages/employer/candidates/CandidateRecommendations.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Sparkles,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    Star,
    ThumbsUp,
    ThumbsDown,
    Eye,
    Download,
    Award,
    X,
    CheckCircle,
    AlertCircle,
    Zap,
} from "lucide-react";
import { toast } from "sonner";
import { fetchCandidateRecommendations, fetchJobs } from "../../store/slices/jobs.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/common/UI/Card";
import { Button, Input, Select } from "../../components/common/UI";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
import Skeleton from "../../components/ui/Skeleton";
import { Slider } from "../../components/ui/Slider";
import { Badge } from "../../components/common/UI/Badge";
import type { RootState } from "../../store";
import Avatar, { AvatarFallback, AvatarImage } from "../../components/ui/Avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/Accordion";

// Types
interface Recommendation {
    candidate: {
        _id: string;
        userId: {
            _id: string;
            name: string;
            email: string;
            phone: string;
            location?: string;
            profileImage?: string;
        };
        jobId: {
            _id: string;
            title: string;
            company: string;
        };
    };
    matchScore: number;
    matchDetails: {
        skillsMatch: {
            matched: string[];
            missing: string[];
            matchPercentage: number;
        };
        experienceMatch: {
            candidateYears: number;
            requiredYears: number;
            match: boolean;
        };
        educationMatch: {
            match: boolean;
            details: string;
        };
        aiScore: number;
        overallMatch: number;
    };
    status: string;
    appliedDate: string;
    resume: any;
}

const CandidateRecommendations: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { data, loading, error } = useAppSelector((state: RootState) => state.jobs.recommendations);
    const { jobs } = useAppSelector((state: RootState) => state.jobs);

    const [selectedJob, setSelectedJob] = useState<string>("");
    const [searchSkills, setSearchSkills] = useState<string>("");
    const [minScore, setMinScore] = useState<number>(60);
    const [experienceMin, setExperienceMin] = useState<string>("");
    const [experienceMax, setExperienceMax] = useState<string>("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [selectedCandidate, setSelectedCandidate] = useState<Recommendation | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        dispatch(fetchJobs({ isActive: true }));
    }, [dispatch]);

    useEffect(() => {
        fetchRecommendations();
    }, [pagination.page, selectedJob, minScore, dispatch]);

    const fetchRecommendations = async () => {
        const skillsArray = searchSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        await dispatch(fetchCandidateRecommendations({
            jobId: selectedJob || undefined,
            limit: pagination.limit,
            minScore: minScore,
            skills: skillsArray.length > 0 ? skillsArray : undefined,
            experienceMin: experienceMin ? parseInt(experienceMin) : undefined,
            experienceMax: experienceMax ? parseInt(experienceMax) : undefined,
        }));
    };

    const handleApplyFilters = () => {
        setPagination({ ...pagination, page: 1 });
        fetchRecommendations();
    };

    const handleResetFilters = () => {
        setSearchSkills("");
        setMinScore(60);
        setExperienceMin("");
        setExperienceMax("");
        setSelectedJob("");
        setPagination({ ...pagination, page: 1 });
        setTimeout(fetchRecommendations, 100);
    };

    const handleStatusChange = async (candidateId: string, newStatus: string) => {
        try {
            // await employerService.updateCandidateStatus(candidateId, {
            //     status: newStatus,
            // });
            toast.success(`Candidate ${newStatus} successfully`);
            fetchRecommendations();
        } catch (error) {
            toast.error("Failed to update candidate status");
        }
    };

    const handleViewResume = (candidateId: string) => {
        navigate(`/employer/candidates/${candidateId}/resume`);
    };

    const handleDownloadResume = async (candidateId: string) => {
        try {
            // await employerService.downloadResume(candidateId);
            toast.success("Resume downloaded successfully");
        } catch (error) {
            toast.error("Failed to download resume");
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            pending: { color: "bg-yellow-500", label: "Pending" },
            reviewed: { color: "bg-blue-500", label: "Reviewed" },
            shortlisted: { color: "bg-green-500", label: "Shortlisted" },
            interviewing: { color: "bg-purple-500", label: "Interviewing" },
            hired: { color: "bg-emerald-500", label: "Hired" },
            rejected: { color: "bg-red-500", label: "Rejected" },
        };
        return statusMap[status] || { color: "bg-gray-500", label: status || "Unknown" };
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getInitials = (name: string) => {
        return name?.charAt(0)?.toUpperCase() || "C";
    };

    const getMatchLabel = (score: number) => {
        if (score >= 80) return { label: "Excellent Match", icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> };
        if (score >= 60) return { label: "Good Match", icon: <ThumbsUp className="w-4 h-4 text-green-500" /> };
        if (score >= 40) return { label: "Potential Match", icon: <AlertCircle className="w-4 h-4 text-yellow-500" /> };
        return { label: "Low Match", icon: <ThumbsDown className="w-4 h-4 text-red-500" /> };
    };

    // Calculate stats
    const totalRecommendations = data?.length || 0;
    const excellentMatches = data?.filter((r: any) => r.matchScore >= 80).length || 0;
    const goodMatches = data?.filter((r: any) => r.matchScore >= 60 && r.matchScore < 80).length || 0;
    const avgScore = totalRecommendations > 0
        ? Math.round(data.reduce((acc: number, r: any) => acc + r.matchScore, 0) / totalRecommendations)
        : 0;

    // Job options for select
    const jobOptions = jobs.map(job => ({
        value: job._id,
        label: job.title
    }));

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-8 h-8 text-purple-500" />
                            AI-Powered Recommendations
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Find the best candidates matched to your job requirements using AI
                        </p>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/employer/candidates")}
                        >
                            View All Candidates
                        </Button>
                        <Button onClick={() => navigate("/employer/jobs")}>
                            <Briefcase className="w-4 h-4 mr-2" />
                            Manage Jobs
                        </Button>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-700">Total Recommendations</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {totalRecommendations}
                                    </p>
                                </div>
                                <Sparkles className="w-8 h-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Excellent Matches</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {excellentMatches}
                                    </p>
                                </div>
                                <Star className="w-8 h-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Good Matches</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {goodMatches}
                                    </p>
                                </div>
                                <ThumbsUp className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Average Match Score</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {avgScore}%
                                    </p>
                                </div>
                                <Award className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Filters</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </Button>
                        </div>
                    </CardHeader>
                    {showFilters && (
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Job Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Job
                                    </label>
                                    <Select
                                        value={selectedJob}
                                        onChange={(value: any) => setSelectedJob(value)}
                                        options={jobOptions}
                                        placeholder="Select a job"
                                    />
                                </div>

                                {/* Skills Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Required Skills (comma separated)
                                    </label>
                                    <Input
                                        placeholder="React, Node.js, TypeScript"
                                        value={searchSkills}
                                        onChange={(e) => setSearchSkills(e.target.value)}
                                    />
                                </div>

                                {/* Min Score Slider */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Match Score: {minScore}%
                                    </label>
                                    <Slider
                                        value={[minScore]}
                                        onValueChange={(value) => setMinScore(value[0])}
                                        min={0}
                                        max={100}
                                        step={5}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Experience Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Min Experience (years)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={experienceMin}
                                        onChange={(e) => setExperienceMin(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Experience (years)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="20"
                                        value={experienceMax}
                                        onChange={(e) => setExperienceMax(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button onClick={handleApplyFilters} className="w-full">
                                        <Search className="w-4 h-4 mr-2" />
                                        Apply Filters
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleResetFilters}
                                        className="w-full"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Recommendations List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recommended Candidates</CardTitle>
                        <CardDescription>
                            {totalRecommendations} candidates matched to your requirements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-1/3" />
                                            <Skeleton className="h-3 w-1/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-red-600">
                                    Error Loading Recommendations
                                </h3>
                                <p className="text-gray-500">{error}</p>
                                <Button className="mt-4" onClick={fetchRecommendations}>
                                    Try Again
                                </Button>
                            </div>
                        ) : totalRecommendations === 0 ? (
                            <div className="text-center py-12">
                                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600">
                                    No Recommendations Found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your filters or check back later for new candidates.
                                </p>
                                <Button className="mt-4" onClick={handleResetFilters}>
                                    Reset Filters
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {data.map((rec: any) => {
                                        const statusBadge = getStatusBadge(rec.status);
                                        const matchLabel = getMatchLabel(rec.matchScore);
                                        const scoreColor = getScoreColor(rec.matchScore);

                                        return (
                                            <div
                                                key={rec.candidate._id}
                                                className="flex flex-col p-4 border rounded-lg hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                                                    {/* Candidate Info */}
                                                    <div className="flex items-start gap-4">
                                                        <Avatar className="h-14 w-14">
                                                            <AvatarImage
                                                                src={rec.candidate.userId?.profileImage}
                                                                alt={rec.candidate.userId?.name}
                                                            />
                                                            <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
                                                                {getInitials(rec.candidate.userId?.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                                    {rec.candidate.userId?.name || "Unknown"}
                                                                </h3>
                                                                <Badge
                                                                    className={`${statusBadge.color} text-white`}
                                                                >
                                                                    {statusBadge.label}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Briefcase className="w-3 h-3" />
                                                                    {rec.candidate.jobId?.title || "No job"}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Mail className="w-3 h-3" />
                                                                    {rec.candidate.userId?.email}
                                                                </span>
                                                                {rec.candidate.userId?.phone && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Phone className="w-3 h-3" />
                                                                        {rec.candidate.userId?.phone}
                                                                    </span>
                                                                )}
                                                                {rec.candidate.userId?.location && (
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {rec.candidate.userId?.location}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                                <Badge
                                                                    variant="info"
                                                                    className={`${scoreColor} border-current`}
                                                                >
                                                                    <Zap className="w-3 h-3 mr-1" />
                                                                    AI Score: {rec.matchDetails?.aiScore || rec.matchScore}%
                                                                </Badge>
                                                                <Badge
                                                                    variant="info"
                                                                    className="bg-blue-50 border-blue-200"
                                                                >
                                                                    Exp: {rec.matchDetails?.experienceMatch?.candidateYears || 0} years
                                                                </Badge>
                                                                {rec.matchDetails?.educationMatch?.match && (
                                                                    <Badge
                                                                        variant="info"
                                                                        className="bg-green-50 border-green-200"
                                                                    >
                                                                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                                                        Education Matched
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Match Score */}
                                                    <div className="flex items-center gap-4 mt-3 md:mt-0">
                                                        <div className="text-center">
                                                            <div className="text-3xl font-bold text-purple-600">
                                                                {rec.matchScore}%
                                                            </div>
                                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                {matchLabel.icon}
                                                                <span>{matchLabel.label}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedCandidate(rec);
                                                                    setShowDetailsModal(true);
                                                                }}
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                Details
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="success"
                                                                className="bg-purple-600 hover:bg-purple-700"
                                                                onClick={() =>
                                                                    handleStatusChange(rec.candidate._id, "shortlisted")
                                                                }
                                                            >
                                                                <UserCheck className="w-4 h-4 mr-1" />
                                                                Shortlist
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Skills Match */}
                                                {rec.matchDetails?.skillsMatch && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-sm text-gray-500">Skills Match:</span>
                                                            {rec.matchDetails.skillsMatch.matched?.map((skill: string) => (
                                                                <Badge key={skill} className="bg-green-100 text-green-700">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            {rec.matchDetails.skillsMatch.missing?.map((skill: string) => (
                                                                <Badge
                                                                    key={skill}
                                                                    variant="info"
                                                                    className="text-red-500 border-red-300"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            <span className="text-sm text-gray-500 ml-2">
                                                                ({rec.matchDetails.skillsMatch.matchPercentage || 0}% match)
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                        <p className="text-sm text-gray-500">
                                            Showing {data.length} of {pagination.total} candidates
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setPagination({
                                                        ...pagination,
                                                        page: pagination.page - 1,
                                                    })
                                                }
                                                disabled={pagination.page === 1}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <span className="text-sm">
                                                Page {pagination.page} of {pagination.totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setPagination({
                                                        ...pagination,
                                                        page: pagination.page + 1,
                                                    })
                                                }
                                                disabled={pagination.page === pagination.totalPages}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Candidate Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            Candidate Match Details
                        </DialogTitle>
                        <DialogDescription>
                            Detailed breakdown of how this candidate matches your requirements
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCandidate && (
                        <div className="space-y-6">
                            {/* Candidate Profile */}
                            <div className="flex items-center gap-4 pb-4 border-b">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage
                                        src={selectedCandidate.candidate.userId?.profileImage}
                                        alt={selectedCandidate.candidate.userId?.name}
                                    />
                                    <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                                        {getInitials(selectedCandidate.candidate.userId?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {selectedCandidate.candidate.userId?.name || "Unknown"}
                                    </h2>
                                    <p className="text-gray-500">
                                        {selectedCandidate.candidate.jobId?.title || "No job"} at{" "}
                                        {selectedCandidate.candidate.jobId?.company || "Unknown company"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Applied {new Date(selectedCandidate.appliedDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Overall Match Score */}
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Overall Match</h3>
                                        <p className="text-sm text-gray-500">
                                            Based on skills, experience, education, and AI analysis
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-purple-600">
                                            {selectedCandidate.matchScore}%
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            {getMatchLabel(selectedCandidate.matchScore).icon}
                                            <span>{getMatchLabel(selectedCandidate.matchScore).label}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Match Details Accordion */}
                            <Accordion type="single" collapsible className="w-full">
                                {/* Skills Match */}
                                <AccordionItem value="skills">
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            Skills Match ({selectedCandidate.matchDetails?.skillsMatch?.matchPercentage || 0}%)
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm font-medium text-green-600">Matched Skills:</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {selectedCandidate.matchDetails?.skillsMatch?.matched?.map((skill) => (
                                                        <Badge key={skill} className="bg-green-100 text-green-700">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {(!selectedCandidate.matchDetails?.skillsMatch?.matched || selectedCandidate.matchDetails.skillsMatch.matched.length === 0) && (
                                                        <p className="text-sm text-gray-500">No skills matched</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-red-600">Missing Skills:</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {selectedCandidate.matchDetails?.skillsMatch?.missing?.map((skill) => (
                                                        <Badge key={skill} variant="info" className="text-red-500 border-red-300">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {(!selectedCandidate.matchDetails?.skillsMatch?.missing || selectedCandidate.matchDetails.skillsMatch.missing.length === 0) && (
                                                        <p className="text-sm text-green-600">All skills matched!</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Experience Match */}
                                <AccordionItem value="experience">
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-blue-500" />
                                            Experience Match
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Candidate Experience</p>
                                                <p className="text-lg font-semibold">
                                                    {selectedCandidate.matchDetails?.experienceMatch?.candidateYears || 0} years
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Required Experience</p>
                                                <p className="text-lg font-semibold">
                                                    {selectedCandidate.matchDetails?.experienceMatch?.requiredYears || 0} years
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <Badge
                                                className={
                                                    selectedCandidate.matchDetails?.experienceMatch?.match
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }
                                            >
                                                {selectedCandidate.matchDetails?.experienceMatch?.match
                                                    ? "✅ Experience requirement met"
                                                    : "❌ Experience requirement not met"}
                                            </Badge>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Education Match */}
                                <AccordionItem value="education">
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-purple-500" />
                                            Education Match
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            <Badge
                                                className={
                                                    selectedCandidate.matchDetails?.educationMatch?.match
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }
                                            >
                                                {selectedCandidate.matchDetails?.educationMatch?.match
                                                    ? "✅ Education matched"
                                                    : "⚠️ No education data available"}
                                            </Badge>
                                            <p className="text-sm text-gray-600">
                                                {selectedCandidate.matchDetails?.educationMatch?.details || "No education details available"}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* AI Score */}
                                <AccordionItem value="ai">
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-orange-500" />
                                            AI Analysis Score
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl font-bold text-orange-500">
                                                {selectedCandidate.matchDetails?.aiScore || selectedCandidate.matchScore}%
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-orange-500 rounded-full"
                                                        style={{
                                                            width: `${selectedCandidate.matchDetails?.aiScore || selectedCandidate.matchScore}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            AI-generated score based on resume analysis and job requirements
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                                <Button
                                    onClick={() => handleViewResume(selectedCandidate.candidate._id)}
                                    variant="outline"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Resume
                                </Button>
                                <Button
                                    onClick={() => handleDownloadResume(selectedCandidate.candidate._id)}
                                    variant="outline"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Resume
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                        handleStatusChange(selectedCandidate.candidate._id, "shortlisted");
                                        setShowDetailsModal(false);
                                    }}
                                >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Shortlist Candidate
                                </Button>
                                <Button
                                    variant="outline"
                                    className="ml-auto"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        navigate(`/employer/candidates/${selectedCandidate.candidate._id}`);
                                    }}
                                >
                                    View Full Profile
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CandidateRecommendations;