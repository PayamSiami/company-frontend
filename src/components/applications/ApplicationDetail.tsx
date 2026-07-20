// frontend-company/src/components/applications/ApplicationDetail.tsx
import React, { useState } from 'react';
import { ApplicationStatus } from '../../types';
import { Badge } from '../common/UI/Badge';
import { ProgressBar } from '../common/UI/ProgressBar';
import { Button } from '../common/UI/Button';
import {
  Star,
  Clock,
  MessageSquare,
  Mail,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  Download,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

interface ApplicationDetailProps {
  application: any;
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ application }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['summary', 'screening']);

  const getStatusColor = (status: string) => {
    const colors = {
      [ApplicationStatus.PENDING]: 'warning',
      [ApplicationStatus.REVIEWING]: 'info',
      [ApplicationStatus.SHORTLISTED]: 'success',
      [ApplicationStatus.REJECTED]: 'danger',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'purple',
      [ApplicationStatus.HIRED]: 'emerald',
    };
    return colors[status as ApplicationStatus] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      [ApplicationStatus.PENDING]: Clock,
      [ApplicationStatus.REVIEWING]: User,
      [ApplicationStatus.SHORTLISTED]: Star,
      [ApplicationStatus.REJECTED]: XCircle,
      [ApplicationStatus.INTERVIEW_SCHEDULED]: Calendar,
      [ApplicationStatus.HIRED]: CheckCircle,
    };
    return icons[status as ApplicationStatus] || AlertCircle;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'در انتظار',
      'REVIEWING': 'در حال بررسی',
      'SHORTLISTED': 'انتخاب شده',
      'REJECTED': 'رد شده',
      'INTERVIEW_SCHEDULED': 'مصاحبه برنامه‌ریزی شده',
      'HIRED': 'استخدام شده',
    };
    return labels[status] || status?.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => expandedSections.includes(section);

  const formatDate = (date: string) => {
    if (!date) return 'نامشخص';
    return new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusIcon = getStatusIcon(application.status);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Top Row */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/25">
                  {application?.userId?.username?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {application?.userId?.username || 'داوطلب ناشناس'}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {application.candidateId}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ثبت درخواست {formatDate(application.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant={getStatusColor(application.status) as any}
                className="flex items-center gap-1.5 px-4 py-1.5"
              >
                <StatusIcon className="w-4 h-4" />
                {getStatusLabel(application.status)}
              </Badge>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">عنوان شغل</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {application.jobTitle || 'نامشخص'}
                </p>
              </div>
            </div>

            {application.expectedSalary && (
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">حقوق مورد انتظار</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {application.expectedSalary.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
              </div>
            )}

            {application.availableFrom && (
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                  <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">تاریخ آمادگی</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(application.availableFrom)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">امتیاز هوش مصنوعی</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {application.aiScore || 0}%
                  </span>
                  <ProgressBar
                    value={application.aiScore || 0}
                    max={100}
                    className="w-16"
                    color={
                      application.aiScore >= 70 ? 'green' :
                        application.aiScore >= 40 ? 'yellow' : 'red'
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Letter Section */}
      {application.coverLetter && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          <button
            onClick={() => toggleSection('coverLetter')}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                نامه پوششی
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {application.coverLetter.split(' ').length} کلمه
              </span>
              {isSectionExpanded('coverLetter') ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>
          {isSectionExpanded('coverLetter') && (
            <div className="px-6 pb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-right">
                  {application.coverLetter}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Screening Analysis */}
      {application.aiScreeningData && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          <button
            onClick={() => toggleSection('screening')}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  تحلیل غربالگری هوش مصنوعی
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  مبتنی بر Gemini AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm" className="hidden sm:flex">
                <TrendingUp className="w-3 h-3 ml-1" />
                {application.aiScreeningData.overallMatch}% تطابق
              </Badge>
              {isSectionExpanded('screening') ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          {isSectionExpanded('screening') && (
            <div className="px-6 pb-6 space-y-4">
              {/* Match Scores Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">تطابق مهارت‌ها</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {application.aiScreeningData.skillMatch}%
                    </span>
                    <ProgressBar
                      value={application.aiScreeningData.skillMatch}
                      max={100}
                      className="flex-1 h-1.5"
                      color="blue"
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">تطابق تجربه</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {application.aiScreeningData.experienceMatch}%
                    </span>
                    <ProgressBar
                      value={application.aiScreeningData.experienceMatch}
                      max={100}
                      className="flex-1 h-1.5"
                      color="purple"
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">تطابق تحصیلات</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {application.aiScreeningData.educationMatch}%
                    </span>
                    <ProgressBar
                      value={application.aiScreeningData.educationMatch}
                      max={100}
                      className="flex-1 h-1.5"
                      color="green"
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">تطابق کلی</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {application.aiScreeningData.overallMatch}%
                    </span>
                    <ProgressBar
                      value={application.aiScreeningData.overallMatch}
                      max={100}
                      className="flex-1 h-1.5"
                      color="indigo"
                    />
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {application.aiScreeningData.suggestions?.length > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        پیشنهادات هوش مصنوعی
                      </p>
                      <ul className="mt-1 space-y-1">
                        {application.aiScreeningData.suggestions.map((suggestion: string, idx: number) => (
                          <li key={idx} className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                            <span className="text-amber-400">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  دانلود گزارش
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  مشاهده تحلیل کامل
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status History */}
      {application.statusHistory && application.statusHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          <button
            onClick={() => toggleSection('history')}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                تاریخچه وضعیت
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {application.statusHistory.length} بروزرسانی
              </span>
              {isSectionExpanded('history') ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          {isSectionExpanded('history') && (
            <div className="px-6 pb-6">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute right-6 top-3 bottom-3 w-0.5 bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-4">
                  {application.statusHistory.map((entry: any, idx: number) => {
                    const Icon = getStatusIcon(entry.status);
                    return (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="relative z-10">
                          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant={getStatusColor(entry.status) as any}>
                              {getStatusLabel(entry.status)}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {formatDate(entry.timestamp)}
                            </span>
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Mail className="w-4 h-4" />
          تماس با داوطلب
        </Button>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          برنامه‌ریزی مصاحبه
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          مشاهده رزومه
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          دانلود رزومه
        </Button>
      </div>
    </div>
  );
};