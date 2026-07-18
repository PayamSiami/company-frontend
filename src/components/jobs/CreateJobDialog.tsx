// frontend-company/src/components/jobs/CreateJobDialog.tsx
import React, { useState } from 'react';
import {
    X,
    Plus,
    Sparkles,
    Briefcase,
    DollarSign,
    Users,
    Zap,
    Check,
    Loader2
} from 'lucide-react';
import { Modal } from '../common/UI/Modal';
import { Button } from '../common/UI/Button';
import { Input } from '../common/UI/Input';
import { Select } from '../common/UI/Select';
import { Badge } from '../common/UI/Badge';
import { cn } from '../../lib/utils';
import { createJob } from '../../store/slices/jobs.slice';
import { toast } from 'sonner';
import { useAppDispatch } from '../../store/hooks';


export const JOB_TYPES = [
    "full-time",
    "part-time",
    "contract",
    "internship",
] as const;
export const EXPERIENCE_LEVELS = ["entry", "mid", "senior", "lead"] as const;
export const WORK_MODES = ["remote", "hybrid", "on-site"] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type WorkMode = (typeof WORK_MODES)[number];

interface CreateJobDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface JobFormData {
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    benefits: string;
    skills: string[];
    location: string,
    salaryRange: {
        min: number;
        max: number;
        currency: string;
    };
    jobType: JobType;
    workMode: WorkMode;
    experienceLevel: string;
    openings: number;
    applicationDeadline: string;
    expiresAt: string;
}

const initialFormData: JobFormData = {
    title: '',
    description: '',
    requirements: '',
    responsibilities: "",
    benefits: '',
    skills: [],
    location: "USA",
    salaryRange: {
        min: 0,
        max: 0,
        currency: 'USD',
    },
    workMode: "remote",
    jobType: 'full-time',
    experienceLevel: 'mid',
    openings: 1,
    applicationDeadline: '',
    expiresAt: '',
};

const steps = [
    { label: 'Basic Info', icon: Briefcase },
    { label: 'Details', icon: Sparkles },
    { label: 'Requirements', icon: Users },
    { label: 'Compensation', icon: DollarSign },
];

const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
];

const workModes = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'on-site', label: 'On-Site' },
];

const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid-Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
];

const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' },
];

export const CreateJobDialog: React.FC<CreateJobDialogProps> = ({
    open,
    onOpenChange,
    onSuccess,
}) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<JobFormData>(initialFormData);
    const [currentInput, setCurrentInput] = useState('');
    const [currentInputType, setCurrentInputType] = useState<'benefit' | 'skill'>('benefit');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [activeStep, setActiveStep] = useState(0);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent as keyof JobFormData] as any,
                [field]: value,
            },
        }));
    };

    const handleAddItem = (type: 'skills') => {
        if (!currentInput.trim()) return;
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], currentInput.trim()],
        }));
        setCurrentInput('');
    };

    const handleRemoveItem = (type: 'skills', index: number) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent, type: 'skills') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItem(type);
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 0) {
            if (!formData.title.trim()) newErrors.title = 'Job title is required';
            if (!formData.description.trim()) newErrors.description = 'Job description is required';
        }

        if (step === 1) {
            if (formData.requirements.length === 0) newErrors.requirements = 'At least one requirement is required';
            if (formData.responsibilities.length === 0) newErrors.responsibilities = 'At least one responsibility is required';
        }

        if (step === 2) {
            if (formData.openings < 1) newErrors.openings = 'At least 1 opening is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handlePrev = () => {
        setActiveStep(prev => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        if (!validateStep(activeStep)) return;

        setIsSubmitting(true);
        try {
            await dispatch(createJob(formData)).unwrap();
            toast.success('Job created successfully!');
            onOpenChange(false);
            setFormData(initialFormData);
            setActiveStep(0);
            onSuccess?.();
        } catch (error) {
            toast.error('Failed to create job');
            console.error('Create job error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setFormData(initialFormData);
        setActiveStep(0);
        setErrors({});
    };

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Post a New Job"
            size="lg"
            className="max-w-3xl"
        >
            <div className="p-6 space-y-6">
                {/* Steps */}
                <div className="flex items-center gap-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <button
                                onClick={() => setActiveStep(index)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                                    activeStep === index
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                <step.icon className="w-4 h-4" />
                                {step.label}
                            </button>
                            {index < steps.length - 1 && (
                                <span className="text-gray-300 dark:text-gray-600">→</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                <div className="min-h-75">
                    {/* Step 0: Basic Info */}
                    {activeStep === 0 && (
                        <div className="space-y-4">
                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Job Title *
                                </label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="e.g., Senior Full Stack Developer"
                                    error={!!errors.title}
                                />
                                {errors.title && (
                                    <p className="mt-1 flex text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Job Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={4}
                                    className={cn(
                                        "w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                                        errors.description
                                            ? "border-red-500"
                                            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                                    )}
                                    placeholder="Describe the job role, team, and company culture..."
                                />
                                {errors.description && (
                                    <p className="mt-1 flex text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Job Type
                                    </label>
                                    <Select
                                        value={formData.jobType}
                                        onChange={(e) => handleChange('jobType', e.target.value)}
                                        options={jobTypes}
                                    />
                                </div>
                                <div>
                                    <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Experience Level
                                    </label>
                                    <Select
                                        value={formData.experienceLevel}
                                        onChange={(e) => handleChange('experienceLevel', e.target.value)}
                                        options={experienceLevels}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Work Mode
                                </label>
                                <div className="flex gap-2">
                                    {workModes.map((mode) => (
                                        <button
                                            key={mode.value}
                                            onClick={() => handleChange('workMode', mode.value)}
                                            className={cn(
                                                "px-4 py-2 text-sm font-medium rounded-xl border transition-all",
                                                formData.workMode === mode.value
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            {mode.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Details */}
                    {activeStep === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Location
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    <Input
                                        value={formData.location}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                        placeholder="City"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Requirements *
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={formData.requirements}
                                        onChange={(e) => handleChange('requirements', e.target.value)}
                                        placeholder="Add a requirement..."
                                        className="flex-1"
                                    />
                                </div>
                                {errors.requirements && (
                                    <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Responsibilities *
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={formData.responsibilities}
                                        onChange={(e) => handleChange('responsibilities', e.target.value)}
                                        placeholder="Add a responsibility..."
                                        className="flex-1"
                                    />
                                </div>
                                {errors.responsibilities && (
                                    <p className="mt-1 text-sm text-red-600">{errors.responsibilities}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Compensation */}
                    {activeStep === 2 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Minimum Salary
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.salaryRange.min}
                                        onChange={(e) => handleNestedChange('salaryRange', 'min', parseFloat(e.target.value) || 0)}
                                        placeholder="50000"
                                    />
                                </div>
                                <div>
                                    <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Maximum Salary
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.salaryRange.max}
                                        onChange={(e) => handleNestedChange('salaryRange', 'max', parseFloat(e.target.value) || 0)}
                                        placeholder="90000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Currency
                                </label>
                                <Select
                                    value={formData.salaryRange.currency}
                                    onChange={(e) => handleNestedChange('salaryRange', 'currency', e.target.value)}
                                    options={currencies}
                                />
                            </div>

                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Openings *
                                </label>
                                <Input
                                    type="number"
                                    value={formData.openings}
                                    onChange={(e) => handleChange('openings', parseInt(e.target.value) || 1)}
                                    min={1}
                                    error={!!errors.openings}
                                />
                                {errors.openings && (
                                    <p className="mt-1 text-sm text-red-600">{errors.openings}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Application Deadline
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.applicationDeadline}
                                        onChange={(e) => handleChange('applicationDeadline', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Expires At
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.expiresAt}
                                        onChange={(e) => handleChange('expiresAt', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Benefits
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={formData.benefits}
                                        onChange={(e) => {
                                            handleChange("benefits", e.target.value)
                                            setCurrentInputType('benefit');
                                            setCurrentInput(e.target.value);
                                        }}
                                        placeholder="Add a benefit..."
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Skills */}
                    {activeStep === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Required Skills
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={currentInputType === 'skill' ? currentInput : ''}
                                        onChange={(e) => {
                                            setCurrentInputType('skill');
                                            setCurrentInput(e.target.value);
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, 'skills')}
                                        placeholder="Add a skill..."
                                        className="flex-1"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setCurrentInputType('skill');
                                            handleAddItem('skills');
                                        }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {formData.skills.map((skill, index) => (
                                        <Badge key={index} variant="gray" className="flex items-center gap-1">
                                            {skill}
                                            <button
                                                onClick={() => handleRemoveItem('skills', index)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">AI-Powered Suggestions</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            Add skills like React, Node.js, Python, or let AI suggest relevant skills based on your job title.
                                        </p>
                                        <Button variant="outline" size="sm" className="mt-2 gap-1.5">
                                            <Zap className="w-3.5 h-3.5" />
                                            Suggest Skills
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>
                        {activeStep > 0 && (
                            <Button variant="outline" onClick={handlePrev}>
                                Back
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        {activeStep < steps.length - 1 ? (
                            <Button variant="primary" onClick={handleNext}>
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Create Job
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateJobDialog;