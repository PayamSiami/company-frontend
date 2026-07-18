// frontend-company/src/components/candidates/CandidateResume.tsx
import React, { useState } from 'react';
import {
    FileText,
    Download,
    Eye,
    Star,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
    Trash2,
    File,
    FileCheck,
    Upload,
    ExternalLink,
} from 'lucide-react';
import { Badge } from '../common/UI/Badge';
import { Button } from '../common/UI/Button';
import { ProgressBar } from '../common/UI/ProgressBar';
import { Modal } from '../common/UI/Modal';
import { toast } from 'sonner';

// ✅ Updated to match API response
interface PdfFile {
    filename: string;
    path: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
}

interface CandidateResumeProps {
    resumes?: any;
    onRefresh?: () => void;
    onUpload?: (file: File) => void;
    onSetDefault?: (resumeId: string) => void;
    onDelete?: (resumeId: string) => void;
    onDownload?: (resumeId: string) => void;
    onPreview?: (resumeId: string) => void;
}

// ✅ Convert single resume to array for consistent handling
const normalizeResumes = (resumes?: any | any[]): any[] => {
    if (!resumes) return [];
    if (Array.isArray(resumes)) return resumes;
    return [resumes];
};

// ✅ Calculate completion score based on filled fields
const calculateCompletionScore = (resume: any): number => {
    let score = 0;
    let totalFields = 0;

    // Personal Info
    if (resume.personalInfo) {
        totalFields += 5;
        if (resume.personalInfo.firstName) score++;
        if (resume.personalInfo.lastName) score++;
        if (resume.personalInfo.email) score++;
        if (resume.personalInfo.phone) score++;
        if (resume.personalInfo.location) score++;
    }

    // Skills
    if (resume.skills) {
        totalFields += 1;
        if (resume.skills.length > 0) score++;
    }

    // Experience
    if (resume.experience) {
        totalFields += 1;
        if (resume.experience.length > 0) score++;
    }

    // Education
    if (resume.education) {
        totalFields += 1;
        if (resume.education.length > 0) score++;
    }

    // Certifications
    if (resume.certifications) {
        totalFields += 1;
        if (resume.certifications.length > 0) score++;
    }

    // Languages
    if (resume.languages) {
        totalFields += 1;
        if (resume.languages.length > 0) score++;
    }

    // Projects
    if (resume.projects) {
        totalFields += 1;
        if (resume.projects.length > 0) score++;
    }

    return totalFields > 0 ? Math.round((score / totalFields) * 100) : 0;
};

// ✅ Convert single resume to display format
const convertToDisplayResume = (resume: any) => ({
    _id: resume._id,
    title: resume.title || 'Untitled Resume',
    template: resume.template || 'modern',
    visibility: resume.visibility || 'private',
    isDefault: resume.isDefault || false,
    completionScore: calculateCompletionScore(resume),
    fileUrl: resume.pdfFile?.path,
    fileName: resume.pdfFile?.filename,
    fileSize: resume.pdfFile?.size,
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
    pdfFile: resume.pdfFile,
});

const ResumeCard: React.FC<{
    resume: any;
    onSetDefault?: (id: string) => void;
    onDelete?: (id: string) => void;
    onDownload?: (id: string) => void;
    onPreview?: (id: string) => void;
}> = ({ resume, onSetDefault, onDelete, onDownload, onPreview }) => {
    const displayResume = convertToDisplayResume(resume);

    const getVisibilityBadge = (visibility: string) => {
        const config: Record<string, { variant: 'success' | 'gray' | 'info' | 'warning', label: string }> = {
            public: { variant: 'success', label: 'Public' },
            private: { variant: 'gray', label: 'Private' },
            link_only: { variant: 'info', label: 'Link Only' },
            PUBLIC: { variant: 'success', label: 'Public' },
            PRIVATE: { variant: 'gray', label: 'Private' },
            LINK_ONLY: { variant: 'info', label: 'Link Only' },
        };
        return config[visibility] || { variant: 'gray', label: visibility };
    };

    const getTemplateBadge = (template: string) => {
        const config: Record<string, { variant: 'info' | 'gray' | 'success', label: string }> = {
            modern: { variant: 'info', label: 'Modern' },
            classic: { variant: 'gray', label: 'Classic' },
            minimal: { variant: 'gray', label: 'Minimal' },
            professional: { variant: 'success', label: 'Professional' },
            creative: { variant: 'info', label: 'Creative' },
        };
        return config[template] || { variant: 'gray', label: template };
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const visibilityConfig = getVisibilityBadge(displayResume.visibility);
    const templateConfig = getTemplateBadge(displayResume.template);

    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {displayResume.title}
                                </h4>
                                {displayResume.isDefault && (
                                    <Badge variant="success" size="sm" className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Default
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <Badge variant={templateConfig.variant} size="sm">
                                    {templateConfig.label}
                                </Badge>
                                <Badge variant={visibilityConfig.variant} size="sm">
                                    {visibilityConfig.label}
                                </Badge>
                                {displayResume.fileName && (
                                    <span className="flex items-center gap-1">
                                        <File className="w-3 h-3" />
                                        {displayResume.fileName}
                                        <span className="text-gray-400">
                                            ({formatFileSize(displayResume.fileSize)})
                                        </span>
                                    </span>
                                )}
                                {!displayResume.fileName && (
                                    <span className="flex items-center gap-1 text-yellow-500">
                                        <File className="w-3 h-3" />
                                        No file uploaded
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Completion Score */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {displayResume.completionScore}%
                                </span>
                                <ProgressBar
                                    value={displayResume.completionScore}
                                    max={100}
                                    className="w-16 h-1.5"
                                    color={displayResume.completionScore >= 70 ? 'green' : displayResume.completionScore >= 40 ? 'yellow' : 'red'}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                {!displayResume.isDefault && (
                                    <button
                                        onClick={() => onSetDefault?.(resume._id)}
                                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        title="Set as default"
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                )}
                                {displayResume.fileUrl && (
                                    <>
                                        <button
                                            onClick={() => onPreview?.(resume._id)}
                                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            title="Preview"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDownload?.(resume._id)}
                                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => onDelete?.(resume._id)}
                                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Updated: {new Date(displayResume.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Created: {new Date(displayResume.createdAt).toLocaleDateString()}
                        </span>
                        {displayResume.pdfFile?.uploadedAt && (
                            <span className="flex items-center gap-1">
                                <Upload className="w-3 h-3" />
                                Uploaded: {new Date(displayResume.pdfFile.uploadedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CandidateResume: React.FC<CandidateResumeProps> = ({
    resumes,
    onRefresh,
    onUpload,
    onSetDefault,
    onDelete,
    onDownload,
    onPreview,
}) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // ✅ Normalize resumes to array
    const resumeArray = normalizeResumes(resumes);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a PDF or Word document');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file');
            return;
        }

        setUploading(true);
        try {
            await onUpload?.(selectedFile);
            toast.success('Resume uploaded successfully!');
            setShowUploadModal(false);
            setSelectedFile(null);
        } catch (error) {
            toast.error('Failed to upload resume');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = (resumeId: string) => {
        onDownload?.(resumeId);
        toast.success('Downloading resume...');
    };

    const handleSetDefault = (resumeId: string) => {
        onSetDefault?.(resumeId);
        toast.success('Default resume updated!');
    };

    const handleDelete = (resumeId: string) => {
        if (window.confirm('Are you sure you want to delete this resume?')) {
            onDelete?.(resumeId);
            toast.success('Resume deleted successfully!');
        }
    };

    const handlePreview = (resumeId: string) => {
        onPreview?.(resumeId);
        toast.info('Opening resume preview...');
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Resumes
                        <Badge variant="gray" size="sm">
                            {resumeArray.length} total
                        </Badge>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage candidate resumes</p>
                </div>
                <div className="flex items-center gap-2">
                    {onRefresh && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRefresh}
                            className="h-8 w-8 p-0"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUploadModal(true)}
                        className="gap-1.5"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Resume
                    </Button>
                </div>
            </div>

            {/* Resume List */}
            {resumeArray.length > 0 ? (
                <div className="space-y-3">
                    {resumeArray.map((resume) => (
                        <ResumeCard
                            key={resume._id}
                            resume={resume}
                            onSetDefault={handleSetDefault}
                            onDelete={handleDelete}
                            onDownload={handleDownload}
                            onPreview={handlePreview}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">No resumes uploaded</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Upload a resume to get started
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUploadModal(true)}
                        className="mt-4 gap-1.5"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Resume
                    </Button>
                </div>
            )}

            {/* Upload Modal */}
            <Modal
                isOpen={showUploadModal}
                onClose={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                }}
                title="Upload Resume"
                size="sm"
            >
                <div className="p-6 space-y-4">
                    <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                        <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedFile ? selectedFile.name : 'Drop your resume here or click to browse'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            PDF, DOC, or DOCX (Max 10MB)
                        </p>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>

                    {selectedFile && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <FileCheck className="w-5 h-5 text-blue-500" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <XCircle className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowUploadModal(false);
                                setSelectedFile(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleUpload}
                            isLoading={uploading}
                            disabled={!selectedFile || uploading}
                            className="gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Resume
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CandidateResume;