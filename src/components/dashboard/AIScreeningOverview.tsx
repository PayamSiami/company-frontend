// frontend-company/src/components/dashboard/AIScreeningOverview.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle,
  ChartBarIcon,
  Award,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Brain,
  Activity
} from 'lucide-react';
import { ProgressBar } from '../common/UI/ProgressBar';
import { Badge } from '../common/UI/Badge';
import { cn } from '../../lib/utils';
import type { AIScreeningDataDto } from '../../types';
import { formatDate } from '../../utils/utils';

interface AIScreeningOverviewProps {
  data: AIScreeningDataDto;
  onRefresh?: () => void;
  className?: string;
}

export const AIScreeningOverview: React.FC<AIScreeningOverviewProps> = ({
  data,
  className = ''
}) => {
  const {
    screeningCoverage,
    totalCandidatesScreened,
    candidatesNotScreened,
    pendingScreening = [],
    screeningHistory = []
  } = data;

  const [expandedJobs, setExpandedJobs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const toggleJobExpand = (jobId: string) => {
    setExpandedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'تطابق بالا';
    if (score >= 40) return 'تطابق متوسط';
    return 'تطابق پایین';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const averageScore = screeningHistory.length > 0
    ? screeningHistory.reduce((sum, job) => sum + job.avgScore, 0) / screeningHistory.length
    : 0;

  const topPerformingJob = screeningHistory.length > 0
    ? screeningHistory.reduce((a, b) => a.avgScore > b.avgScore ? a : b)
    : null;

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden",
      className
    )} dir="rtl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              نمای کلی غربالگری هوش مصنوعی
              <Badge variant="info" size="sm" className="mr-2">
                <Activity className="w-3 h-3 ml-1" />
                زنده
              </Badge>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setViewMode('overview')}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                viewMode === 'overview'
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              نمای کلی
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                viewMode === 'detailed'
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              جزئیات
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="gap-1 flex flex-col bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100/50 dark:border-indigo-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">پوشش</span>
              <ChartBarIcon className="h-5 w-5 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {Math.round(screeningCoverage)}%
            </p>
            <ProgressBar
              value={screeningCoverage}
              max={100}
              className="mt-2 h-1.5"
              color="indigo"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {totalCandidatesScreened} از {totalCandidatesScreened + candidatesNotScreened} غربال شده
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100/50 dark:border-green-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">غربال شده</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {totalCandidatesScreened || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              داوطلب تحلیل شده
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-100/50 dark:border-yellow-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">در انتظار</span>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {candidatesNotScreened || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              در انتظار تحلیل هوش مصنوعی
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-100/50 dark:border-blue-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">میانگین امتیاز</span>
              <Award className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {Math.round(averageScore)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              در {screeningHistory.length} شغل
            </p>
          </div>
        </div>

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <>
            {/* Pending Screening List */}
            {pendingScreening.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    در انتظار غربالگری هوش مصنوعی
                    <Badge variant="warning" size="sm">{pendingScreening.length}</Badge>
                  </h3>
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    مشاهده همه
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pl-1">
                  {pendingScreening.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-white text-xs font-medium">
                          {app.candidateName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {app.candidateName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {app.jobTitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {formatDate(app.appliedDate)}
                        </span>
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-full font-medium">
                          در انتظار
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Performing Job */}
            {topPerformingJob && (
              <div className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        بهترین شغل
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {topPerformingJob.jobTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.round(topPerformingJob.avgScore)}%
                    </span>
                    <Badge variant="success">بهترین تطابق</Badge>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Detailed Mode */}
        {viewMode === 'detailed' && (
          <>
            {/* Screening History */}
            {screeningHistory.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    غربالگری بر اساس شغل
                    <Badge variant="gray" size="sm">{screeningHistory.length} شغل</Badge>
                  </h3>
                </div>
                <div className="space-y-2">
                  {screeningHistory.slice(0, 5).map((job, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        onClick={() => toggleJobExpand(job.jobId)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-medium">
                            {job.jobTitle?.charAt(0) || 'J'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {job.jobTitle}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {job.screenedCount} از {job.totalApplicants} غربال شده
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-semibold",
                              getScoreColor(job.avgScore)
                            )}>
                              {Math.round(job.avgScore)}%
                            </span>
                            <Badge
                              variant={getScoreBadgeColor(job.avgScore)}
                              size="sm"
                            >
                              {getScoreLabel(job.avgScore)}
                            </Badge>
                          </div>
                          {expandedJobs.includes(job.jobId) ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {expandedJobs.includes(job.jobId) && (
                        <div className="px-4 pb-4 pt-2">
                          <ProgressBar
                            value={job.avgScore}
                            max={100}
                            className="h-2"
                            color={job.avgScore >= 70 ? 'green' : job.avgScore >= 40 ? 'yellow' : 'red'}
                          />
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>تاریخ ثبت: {formatDate(job.postedDate)}</span>
                            <span>{job.screenedCount} داوطلب غربال شده</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {screeningHistory.length === 0 && pendingScreening.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">هنوز داده‌ای برای غربالگری وجود ندارد</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              برای مشاهده بینش‌های غربالگری هوش مصنوعی، دریافت درخواست‌ها را شروع کنید
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>آخرین بروزرسانی: {new Date().toLocaleString('fa-IR')}</span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-green-500" />
            <span>سیستم فعال</span>
          </span>
        </div>
      </div>
    </div>
  );
};