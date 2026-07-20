// frontend-company/src/components/applications/ApplicationList.tsx
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import {
  bulkUpdateApplications,
  updateApplicationStatus,
  setPage,
} from '../../store/slices/applications.slice';
import { ApplicationStatus, type IApplication } from '../../types/model.types';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Mail,
  Calendar,
  DollarSign,
  Star,
  Users,
  Download,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  FileText,
  MessageSquare,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { ApplicationFilters } from './ApplicationFilters';
import { ProgressBar } from '../common/UI/ProgressBar';
import { Pagination } from '../common/UI/Pagination';
import { StatusUpdateModal } from './StatusUpdateModal';
import { Badge } from '../common/UI/Badge';
import { Button } from '../common/UI/Button';
import { Input } from '../common/UI/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../common/UI/DropdownMenu';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface ApplicationListProps {
  applications: IApplication[];
  loading?: boolean;
  onSelect?: (ids: string[]) => void;
  selectedIds?: string[];
}

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const config = {
    [ApplicationStatus.PENDING]: { color: 'warning', label: 'در انتظار', icon: Clock },
    [ApplicationStatus.REVIEWING]: { color: 'info', label: 'در حال بررسی', icon: Users },
    [ApplicationStatus.SHORTLISTED]: { color: 'success', label: 'انتخاب شده', icon: CheckCircle },
    [ApplicationStatus.REJECTED]: { color: 'danger', label: 'رد شده', icon: XCircle },
    [ApplicationStatus.INTERVIEW_SCHEDULED]: { color: 'purple', label: 'مصاحبه', icon: Calendar },
    [ApplicationStatus.HIRED]: { color: 'emerald', label: 'استخدام شده', icon: Award },
  };

  const { color, label, icon: Icon } = config[status] || { color: 'gray', label: status, icon: FileText };
  return (
    <Badge variant={color as any} className="flex items-center gap-1.5 px-3 py-1">
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
};

const AIScoreDisplay: React.FC<{ score?: number }> = ({ score }) => {
  if (score === undefined || score === null) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
        <span className="text-gray-400 text-sm">در انتظار</span>
      </div>
    );
  }

  const color = score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600';
  const bgColor = score >= 70 ? 'bg-green-50' : score >= 40 ? 'bg-yellow-50' : 'bg-red-50';

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg ${bgColor}`}>
      <Zap className={`h-3.5 w-3.5 ${color}`} />
      <span className={`font-semibold ${color}`}>{score}%</span>
    </div>
  );
};

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  loading = false,
  onSelect,
  selectedIds = [],

}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pagination } = useSelector((state: RootState) => state.applications);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusModal, setStatusModal] = useState<{ id: string; currentStatus: ApplicationStatus } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const handleStatusChange = async (id: string, status: ApplicationStatus, notes?: string) => {
    await dispatch(updateApplicationStatus({ id, data: { status, notes } }));
    setStatusModal(null);
  };

  const toggleSelect = (id: string) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id];
    onSelect?.(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelect?.([]);
    } else {
      onSelect?.(applications.map(app => app._id));
    }
  };

  const handleBulkAction = (status: ApplicationStatus) => {
    dispatch(bulkUpdateApplications({
      ids: selectedIds,
      status,
      notes: `تغییر وضعیت گروهی به ${status}`
    }));
    onSelect?.([]);
  };

  const filteredApplications = useMemo(() => {
    if (!searchTerm) return applications;
    const term = searchTerm.toLowerCase();
    return applications.filter((app: any) =>
      app?.userId?.username.toLowerCase().includes(term) ||
      app?.jobId?.title?.toLowerCase().includes(term) ||
      app.candidateId?.toLowerCase().includes(term) ||
      app.status?.toLowerCase().includes(term)
    );
  }, [applications, searchTerm]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4" dir="rtl">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">در حال بارگذاری درخواست‌ها...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-12 text-center" dir="rtl">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
          <Users className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">هنوز درخواستی وجود ندارد</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
          برای دریافت درخواست از داوطلبان واجد شرایط، ثبت آگهی شغلی را شروع کنید.
        </p>
        <Button className="mt-4 gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <FileText className="w-4 h-4" />
          ثبت آگهی شغلی
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">درخواست‌ها</h2>
          </div>
          <Badge variant="gray" className="text-sm">
            {filteredApplications?.length} کل
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی درخواست‌ها..."
              className="pr-9 w-48 md:w-64 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-right"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'table'
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'grid'
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
            >
              <Users className="w-4 h-4" />
            </button>
          </div>

          {selectedIds.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primary" size="sm" className="gap-2">
                  <Users className="w-4 h-4" />
                  {selectedIds.length} انتخاب شده
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleBulkAction(ApplicationStatus.REVIEWING)}>
                  <Users className="w-4 h-4 ml-2" />
                  علامت‌گذاری به عنوان در حال بررسی
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction(ApplicationStatus.SHORTLISTED)}>
                  <Star className="w-4 h-4 ml-2" />
                  انتخاب
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction(ApplicationStatus.REJECTED)}>
                  <XCircle className="w-4 h-4 ml-2" />
                  رد کردن
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ApplicationFilters />

          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">خروجی</span>
          </Button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-right w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredApplications?.length && filteredApplications?.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  داوطلب
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  شغل
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  امتیاز AI
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  تاریخ ثبت
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {filteredApplications && filteredApplications?.map((app: any) => (
                <React.Fragment key={app._id}>
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(app._id)}
                        onChange={() => toggleSelect(app._id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                          {app?.resumeId?.personalInfo?.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white text-right">
                            {app?.resumeId?.personalInfo?.firstName || 'ناشناس'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                            شناسه: {app?.applicantId?._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-white text-right">{app?.jobId?.title}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <AIScoreDisplay score={app.aiScore} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                      {new Date(app.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-left">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label={expandedId === app._id ? 'بستن جزئیات' : 'باز کردن جزئیات'}
                        >
                          {expandedId === app._id ?
                            <ChevronUp className="h-4 w-4" /> :
                            <ChevronDown className="h-4 w-4" />
                          }
                        </button>
                        <button
                          onClick={() => setStatusModal({ id: app._id, currentStatus: app.status })}
                          className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          بروزرسانی
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <Link to={`/applications/${app._id}`}>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 ml-2" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 ml-2" />
                              تماس
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 ml-2" />
                              برنامه‌ریزی مصاحبه
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>

                  {expandedId === app._id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="space-y-4">
                          {app.coverLetter && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                نامه پوششی
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-right">
                                {app.coverLetter}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {app.expectedSalary && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                حقوق مورد انتظار: {app.expectedSalary.toLocaleString('fa-IR')} تومان
                              </div>
                            )}
                            {app.availableFrom && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                تاریخ آمادگی: {new Date(app.availableFrom).toLocaleDateString('fa-IR')}
                              </div>
                            )}
                            {app.resumeUrl && (
                              <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                <Eye className="h-4 w-4" />
                                مشاهده رزومه
                              </button>
                            )}
                            <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              <Mail className="h-4 w-4" />
                              تماس
                            </button>
                          </div>

                          {app.aiScreeningData && (
                            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-indigo-500" />
                                تحلیل غربالگری هوش مصنوعی
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                  { label: 'تطابق مهارت‌ها', value: app.aiScreeningData.skillMatch, color: 'blue' },
                                  { label: 'تطابق تجربه', value: app.aiScreeningData.experienceMatch, color: 'purple' },
                                  { label: 'تطابق تحصیلات', value: app.aiScreeningData.educationMatch, color: 'green' },
                                  { label: 'تطابق کلی', value: app.aiScreeningData.overallMatch, color: 'indigo' },
                                ].map((item) => (
                                  <div key={item.label}>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-sm font-semibold">{item.value}%</span>
                                      <ProgressBar
                                        value={item.value}
                                        max={100}
                                        className="flex-1 h-1.5"
                                        color={item.color as any}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {app.aiScreeningData.suggestions?.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">پیشنهادات</span>
                                  <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside mt-1 space-y-0.5 text-right">
                                    {app.aiScreeningData.suggestions.map((suggestion: any, idx: number) => (
                                      <li key={idx}>{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {app.statusHistory && app.statusHistory.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                تاریخچه وضعیت
                              </h4>
                              <div className="space-y-1.5">
                                {app.statusHistory.map((entry: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-3 text-sm">
                                    <Badge variant="gray" size="sm">{entry.status}</Badge>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                                      {new Date(entry.timestamp).toLocaleString('fa-IR')}
                                    </span>
                                    {entry.notes && (
                                      <span className="text-gray-400 dark:text-gray-500 text-xs">- {entry.notes}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredApplications && filteredApplications?.map((app: any) => (
            <div
              key={app._id}
              className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {app.candidateName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm text-right">
                      {app.candidateName || 'ناشناس'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                      {app.jobTitle}
                    </p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  ثبت {new Date(app.createdAt).toLocaleDateString('fa-IR')}
                </span>
                <AIScoreDisplay score={app.aiScore} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredApplications?.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.limit)}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={(page) => dispatch(setPage(page))}
            showFirstLast
            showPageSize
          />
        </div>
      )}

      {/* Status Update Modal */}
      {statusModal && (
        <StatusUpdateModal
          applicationId={statusModal.id}
          currentStatus={statusModal.currentStatus}
          onClose={() => setStatusModal(null)}
          onUpdate={handleStatusChange}
        />
      )}
    </div>
  );
};