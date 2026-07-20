// frontend-company/src/components/applications/StatusUpdateModal.tsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Link as LinkIcon,
  MessageSquare,
  Clock,
  Users,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  Zap
} from 'lucide-react';
import { ApplicationStatus, type ApplicationStatus as ApplicationStatusType } from '../../types';
import { Button } from '../common/UI/Button';
import { Input } from '../common/UI/Input';
import { Select } from '../common/UI/Select';
import { Modal } from '../common/UI/Modal';
import { cn } from '../../lib/utils';
import { updateApplicationStatus } from '../../store/slices/applications.slice';
import { toast } from 'sonner';
import type { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';

interface StatusUpdateModalProps {
  applicationId: string;
  currentStatus: ApplicationStatusType;
  onClose: () => void;
  candidateName?: string;
  jobTitle?: string;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  applicationId,
  currentStatus,
  onClose,
  candidateName = 'داوطلب',
  jobTitle = 'موقعیت شغلی'
}) => {
  const [status, setStatus] = useState<ApplicationStatusType>(currentStatus);
  const dispatch = useDispatch<AppDispatch>();
  const [notes, setNotes] = useState('');
  const [showInterviewDetails, setShowInterviewDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    scheduledDate: '',
    duration: 60,
    location: '',
    meetingLink: '',
    notes: '',
  });

  const { isLoading } = useSelector(
    (state: RootState) => state.applications
  );


  const handleStatusUpdate = async (status: string, notes?: string, interviewDetails?: any) => {
    if (applicationId) {
      await dispatch(updateApplicationStatus({
        id: applicationId,
        data: { status, notes, ...(interviewDetails && { interviewDetails }) }
      }));
      onClose();
      toast.success('وضعیت درخواست با موفقیت به‌روزرسانی شد!');
    }
  };


  // Auto-show interview details when status is INTERVIEW_SCHEDULED
  useEffect(() => {
    if (status === ApplicationStatus.INTERVIEW_SCHEDULED) {
      setShowInterviewDetails(true);
      setIsExpanded(true);
    } else {
      setShowInterviewDetails(false);
      setIsExpanded(false);
    }
  }, [status]);

  const statusOptions = [
    { value: ApplicationStatus.PENDING, label: 'در انتظار', icon: Clock, color: 'yellow' },
    { value: ApplicationStatus.REVIEWING, label: 'در حال بررسی', icon: Users, color: 'blue' },
    { value: ApplicationStatus.SHORTLISTED, label: 'انتخاب شده', icon: Star, color: 'green' },
    { value: ApplicationStatus.INTERVIEW_SCHEDULED, label: 'مصاحبه برنامه‌ریزی شده', icon: Calendar, color: 'purple' },
    { value: ApplicationStatus.HIRED, label: 'استخدام شده', icon: CheckCircle, color: 'emerald' },
    { value: ApplicationStatus.REJECTED, label: 'رد شده', icon: XCircle, color: 'red' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let interviewDetailsData = undefined;
    if (status === ApplicationStatus.INTERVIEW_SCHEDULED && showInterviewDetails) {
      interviewDetailsData = {
        scheduledDate: interviewDetails.scheduledDate,
        duration: interviewDetails.duration,
        location: interviewDetails.location || undefined,
        meetingLink: interviewDetails.meetingLink || undefined,
        notes: interviewDetails.notes || undefined,
      };
    }

    handleStatusUpdate(status, notes || undefined, interviewDetailsData);
  };

  const getStatusColor = (statusValue: ApplicationStatusType) => {
    const colors = {
      [ApplicationStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      [ApplicationStatus.REVIEWING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      [ApplicationStatus.SHORTLISTED]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      [ApplicationStatus.HIRED]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return colors[statusValue] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getStatusIcon = (statusValue: ApplicationStatusType) => {
    const icons = {
      [ApplicationStatus.PENDING]: Clock,
      [ApplicationStatus.REVIEWING]: Users,
      [ApplicationStatus.SHORTLISTED]: Star,
      [ApplicationStatus.REJECTED]: XCircle,
      [ApplicationStatus.INTERVIEW_SCHEDULED]: Calendar,
      [ApplicationStatus.HIRED]: CheckCircle,
    };
    return icons[statusValue] || AlertCircle;
  };

  const getStatusLabel = (statusValue: ApplicationStatusType) => {
    const labels = {
      [ApplicationStatus.PENDING]: 'در انتظار',
      [ApplicationStatus.REVIEWING]: 'در حال بررسی',
      [ApplicationStatus.SHORTLISTED]: 'انتخاب شده',
      [ApplicationStatus.REJECTED]: 'رد شده',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'مصاحبه برنامه‌ریزی شده',
      [ApplicationStatus.HIRED]: 'استخدام شده',
    };
    return labels[statusValue] || statusValue.replace('_', ' ');
  };

  const StatusIcon = getStatusIcon(currentStatus);

  return (
    <Modal isOpen onClose={onClose} size="lg" className="max-w-2xl">
      <div className="p-6 md:p-8" dir="rtl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-2xl",
              getStatusColor(currentStatus).split(' ')[0]
            )}>
              <StatusIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                بروزرسانی وضعیت درخواست
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {candidateName} • {jobTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Status Display */}
          <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                وضعیت فعلی
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full",
                  getStatusColor(currentStatus)
                )}>
                  <StatusIcon className="h-4 w-4" />
                  {getStatusLabel(currentStatus)}
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <Sparkles className="h-5 w-5 text-gray-300 dark:text-gray-600" />
            </div>
          </div>

          {/* New Status */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              وضعیت جدید *
            </label>
            <div className="relative">
              <Select
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value as ApplicationStatusType;
                  setStatus(newStatus);
                }}
                options={statusOptions.map(opt => ({
                  value: opt.value,
                  label: opt.label
                }))}
                className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>
            {status !== currentStatus && (
              <p className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                وضعیت از {getStatusLabel(currentStatus)} به {getStatusLabel(status)} تغییر خواهد کرد
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              یادداشت (اختیاری)
            </label>
            <div className="relative">
              <MessageSquare className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full pr-9 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-right"
                placeholder="یادداشتی درباره این تغییر وضعیت اضافه کنید..."
              />
            </div>
          </div>

          {/* Interview Details - shown when status is INTERVIEW_SCHEDULED */}
          {status === ApplicationStatus.INTERVIEW_SCHEDULED && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      جزئیات مصاحبه
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      زمان مصاحبه را برای این داوطلب تنظیم کنید
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-3 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      تاریخ و زمان مصاحبه *
                    </label>
                    <Input
                      type="datetime-local"
                      value={interviewDetails.scheduledDate}
                      onChange={(e) => setInterviewDetails({
                        ...interviewDetails,
                        scheduledDate: e.target.value
                      })}
                      required={status === ApplicationStatus.INTERVIEW_SCHEDULED}
                      className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      مدت زمان (دقیقه)
                    </label>
                    <Select
                      value={interviewDetails.duration.toString()}
                      onChange={(e) => setInterviewDetails({
                        ...interviewDetails,
                        duration: parseInt(e.target.value)
                      })}
                      options={[
                        { value: '15', label: '۱۵ دقیقه' },
                        { value: '30', label: '۳۰ دقیقه' },
                        { value: '45', label: '۴۵ دقیقه' },
                        { value: '60', label: '۱ ساعت' },
                        { value: '90', label: '۱.۵ ساعت' },
                        { value: '120', label: '۲ ساعت' },
                      ]}
                      className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      مکان (اختیاری)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        value={interviewDetails.location}
                        onChange={(e) => setInterviewDetails({
                          ...interviewDetails,
                          location: e.target.value
                        })}
                        className="pr-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all text-right"
                        placeholder="آدرس دفتر یا شماره اتاق"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      لینک جلسه (اختیاری)
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="url"
                        value={interviewDetails.meetingLink}
                        onChange={(e) => setInterviewDetails({
                          ...interviewDetails,
                          meetingLink: e.target.value
                        })}
                        className="pr-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all text-right"
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      یادداشت مصاحبه (اختیاری)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        value={interviewDetails.notes}
                        onChange={(e) => setInterviewDetails({
                          ...interviewDetails,
                          notes: e.target.value
                        })}
                        rows={2}
                        className="w-full pr-9 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-right"
                        placeholder="یادداشت‌های اضافی مصاحبه..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'در حال بروزرسانی...' : 'بروزرسانی وضعیت'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};