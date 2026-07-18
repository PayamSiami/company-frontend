// frontend-company/src/pages/AI/Assistant.tsx
import React, { useState, useRef } from 'react';
import {
  Sparkles,
  FileText,
  List,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Star,
  Clock,
  Award,
  MessageSquare,
  Brain,
  Wand2,
  X,
  Trash2,
  Download,
  Clock as ClockIcon,
  Sparkle,
  Zap,
  Loader2,
  AlertCircle,
  Briefcase,
  MapPin,
  DollarSign,
  Tag,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/UI/Card';
import { Badge } from '../../components/common/UI/Badge';
import { Button } from '../../components/common/UI/Button';
import { Input } from '../../components/common/UI/Input';
import { useAppDispatch } from '../../store/hooks';
import { generateJobContent, selectAIError, selectGeneratedJob, selectIsGenerating } from '../../store/slices/ai.slice';

// Types
interface JobData {
  title: string;
  company: string;
  location: string;
  salary: number;
  minSalary: number;
  maxSalary: number;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  workMode: 'remote' | 'hybrid' | 'on-site';
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string;
  benefits: string;
  tags: string[];
}

const AIAssistantPage: React.FC = () => {

  const dispatch = useAppDispatch();
  const generatedContent = useSelector(selectGeneratedJob)
  const error = useSelector(selectAIError)
  const isGenerating = useSelector(selectIsGenerating)
  console.log(generatedContent)

  const [jobData, setJobData] = useState<JobData>({
    title: '',
    company: '',
    location: '',
    salary: 0,
    minSalary: 0,
    maxSalary: 0,
    experienceLevel: 'mid',
    workMode: 'remote',
    jobType: 'full-time',
    description: '',
    requirements: '',
    benefits: '',
    tags: [],
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const generationFields = [
    { id: 'description', label: 'Description', icon: FileText, color: 'blue', description: 'Generate a compelling job description' },
    { id: 'requirements', label: 'Requirements', icon: List, color: 'purple', description: 'List key qualifications and skills' },
    { id: 'benefits', label: 'Benefits', icon: Award, color: 'orange', description: 'Highlight perks and advantages' },
    { id: 'tags', label: 'Tags', icon: Tag, color: 'pink', description: 'Generate relevant tags' },
    { id: 'skills', label: 'Skills', icon: Star, color: 'green', description: 'Identify required technical skills' },
    { id: 'interview', label: 'Interview Questions', icon: MessageSquare, color: 'indigo', description: 'Generate interview questions' },
  ];

  const handleFieldChange = (field: keyof JobData, value: any) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !jobData.tags.includes(tagInput.trim())) {
      setJobData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setJobData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleGenerate = async (field: string) => {
    if (!jobData.title) {
      toast.error('Please enter a job title first');
      return;
    }

    try {
      const result = await dispatch(generateJobContent({
        jobTitle: jobData.title,
        companyName: jobData.company || undefined,
        field: field as any,
        // additionalContext: JSON.stringify({
        //   location: jobData.location,
        //   experienceLevel: jobData.experienceLevel,
        //   workMode: jobData.workMode,
        //   jobType: jobData.jobType,
        //   minSalary: jobData.minSalary,
        //   maxSalary: jobData.maxSalary,
        //   tags: jobData.tags,
        // }),
      })).unwrap();

      if (result) {
        toast.success(`${field} generated successfully!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate content');
    }
  };

  const handleGenerateAll = async () => {
    if (!jobData.title) {
      toast.error('Please enter a job title first');
      return;
    }

    // additionalContext: JSON.stringify({
    //   location: jobData.location,
    //   experienceLevel: jobData.experienceLevel,
    //   workMode: jobData.workMode,
    //   jobType: jobData.jobType,
    //   minSalary: jobData.minSalary,
    //   maxSalary: jobData.maxSalary,
    //   tags: jobData.tags,
    // })
    try {
      await dispatch(generateJobContent({
        jobTitle: jobData.title,
        companyName: jobData.company || undefined,
        field: "summary"
      })).unwrap();

      toast.success('All content generated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate all content');
    }
  };

  const handleSave = async () => {
    if (Object.keys(generatedContent)?.length === 0) {
      toast.error('No content to save');
      return;
    }

    setIsSaving(true);
    try {
      const content: Record<string, string | string[]> = {};
      Object.entries(generatedContent).forEach(([field, data]) => {
        content[field] = data.content;
      });

      // await dispatch(saveGeneratedContent({
      //   jobTitle: jobData.title,
      //   companyName: jobData.company || undefined,
      //   content,
      // })).unwrap();

      toast.success('Content saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (text: string | string[], key: string) => {
    const textToCopy = typeof text === 'string' ? text : text.join('\n• ');
    navigator.clipboard.writeText(textToCopy);
    setCopied(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClearAll = () => {
    // dispatch(clearGeneratedContent());
    toast.info('Cleared all generated content');
  };

  const handleExport = () => {
    const data = {
      job: jobData,
      generatedAt: new Date().toISOString(),
      content: generatedContent
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-content-${jobData.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully!');
  };

  // const getFieldIcon = (field: string) => {
  //   const f = generationFields.find(f => f.id === field);
  //   return f?.icon || FileText;
  // };

  const getFieldColor = (field: string) => {
    const f = generationFields.find(f => f.id === field);
    return f?.color || 'blue';
  };

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'lead', label: 'Lead / Manager' },
  ];

  const workModes = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'on-site', label: 'On-Site' },
  ];

  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                AI Job Assistant
                <Badge variant="info" size="sm" className="ml-2">
                  <Sparkle className="w-3 h-3 mr-1" />
                  Beta
                </Badge>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                Generate job descriptions, requirements, and more with AI
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-1.5"
          >
            <Clock className="w-4 h-4" />
            History
            {history?.length > 0 && (
              <Badge variant="gray" size="sm" className="ml-1">
                {history?.length}
              </Badge>
            )}
          </Button>
          {generatedContent && Object.keys(generatedContent)?.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving} className="gap-1.5">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkle className="w-4 h-4" />}
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll} className="gap-1.5 text-red-500 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <Button variant="ghost" size="sm" className="ml-auto">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-500" />
                Job Details
              </CardTitle>
              <CardDescription>Enter the job information to generate content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title *
                </label>
                <Input
                  value={jobData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g., Senior Full Stack Developer"
                  className="mt-1.5"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Name
                </label>
                <Input
                  value={jobData.company}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  placeholder="e.g., Acme Inc."
                  className="mt-1.5"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <Input
                  value={jobData.location}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  className="mt-1.5"
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience Level
                </label>
                <select
                  value={jobData.experienceLevel}
                  onChange={(e) => handleFieldChange('experienceLevel', e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Mode */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Work Mode
                </label>
                <select
                  value={jobData.workMode}
                  onChange={(e) => handleFieldChange('workMode', e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {workModes.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Type
                </label>
                <select
                  value={jobData.jobType}
                  onChange={(e) => handleFieldChange('jobType', e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Min Salary
                  </label>
                  <Input
                    type="number"
                    value={jobData.minSalary || ''}
                    onChange={(e) => handleFieldChange('minSalary', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Salary
                  </label>
                  <Input
                    type="number"
                    value={jobData.maxSalary || ''}
                    onChange={(e) => handleFieldChange('maxSalary', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags
                </label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button variant="outline" size="sm" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {jobData?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jobData.tags.map((tag) => (
                      <Badge key={tag} variant="gray" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                className="w-full gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                onClick={handleGenerateAll}
                disabled={isGenerating || !jobData.title}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate All
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>Generate specific content sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {generatedContent && generationFields.map((field) => (
                <Button
                  key={field.id}
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  onClick={() => handleGenerate(field.id)}
                // disabled={isGenerating && isGenerating[field.id] || !jobData.title}
                >
                  <field.icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{field.label}</span>
                  {generatedContent[field.id] && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  {/* {isGenerating && isGenerating[field.id] && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  )} */}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Job Preview */}
          {jobData.title && (
            <Card className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-100 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {jobData.title}
                    </span>
                  </div>
                  {jobData.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{jobData.company}</span>
                    </div>
                  )}
                  {(jobData.location || jobData.workMode) && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      {jobData.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {jobData.location}
                        </span>
                      )}
                      {jobData.workMode && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {workModes.find(m => m.value === jobData.workMode)?.label}
                        </span>
                      )}
                    </div>
                  )}
                  {(jobData.minSalary > 0 || jobData.maxSalary > 0) && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <DollarSign className="w-3 h-3" />
                      ${jobData.minSalary.toLocaleString()} - ${jobData.maxSalary.toLocaleString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-100 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Pro Tip</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Fill in as many job details as possible for better, more relevant AI-generated content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Content */}
        <div className="lg:col-span-2 space-y-4" ref={contentRef}>
          {/* History Panel */}
          {showHistory && history?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Generation History
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {/* {history.slice().reverse().map((item, index) => {
                    const Icon = getFieldIcon(item.field);
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="text-sm capitalize">{item.field}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            document.getElementById(`content-${item.field}`)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })} */}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Content Cards */}
          {generationFields && generationFields.map((field) => (
            generatedContent && generatedContent[field.id] && (
              <Card
                key={field.id}
                id={`content-${field.id}`}
                className="hover:shadow-lg transition-all duration-300 border-l-4"
                style={{ borderLeftColor: `var(--color-${getFieldColor(field.id)}-500)` }}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <field.icon className="w-4 h-4" />
                      {field.label}
                      <Badge variant="gray" size="sm" className="ml-2">
                        {typeof generatedContent[field.id] === 'string'
                          ? `${(generatedContent[field.id] as string).split(' ')?.length} words`
                          : `${(generatedContent[field.id] as string[])?.length} items`}
                      </Badge>
                      {generatedContent[field.id] && (
                        <Badge variant="gray" size="sm">
                          {generatedContent[field.id].tokens} tokens
                        </Badge>
                      )}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(
                        generatedContent[field.id],
                        field.id
                      )}
                      className="h-8 px-2"
                    >
                      {copied === field.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerate(field.id)}
                      className="h-8 px-2"
                    // disabled={isGenerating[field.id]}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {Array.isArray(generatedContent[field.id]) ? (
                    <ul className="space-y-2">
                      {(generatedContent[field.id] as string[]).map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm group">
                          <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {generatedContent[field.id] as string}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          ))}

          {/* Empty State */}
          {generatedContent && Object.keys(generatedContent)?.length === 0 && (
            <Card className="border-dashed border-2 bg-gray-50/50 dark:bg-gray-800/30">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  No content generated yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                  Enter job details and click any generation button above to create AI-powered content
                </p>
              </CardContent>
            </Card>
          )}

          {/* Generation Stats */}
          {generatedContent && Object.keys(generatedContent)?.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Sparkle className="w-3 h-3" />
                  {Object.keys(generatedContent).length} sections generated
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  {new Date().toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Export All
                </button>
                <button
                  onClick={handleClearAll}
                  className="hover:text-red-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;