// frontend-company/src/components/applications/StatusUpdateModal.tsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Link as LinkIcon,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { ApplicationStatus, type ApplicationStatus as ApplicationStatusType } from '../../types';
import { Button } from '../common/UI/Button';
import { Input } from '../common/UI/Input';
import { Select } from '../common/UI/Select';
import { Modal } from '../common/UI/Modal';
import { cn } from '../../lib/utils';
import { updateApplicationStatus } from '../../store/slices/applications.slice';
import { toast } from 'sonner';
import type { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { StatusFlowVisualizer } from './StatusFlowVisualizer';
import { StatusActionCards } from './StatusActionCards';
import { STATUS_FLOW } from '../../config/statusFlow';

interface StatusUpdateModalProps {
  applicationId: string;
  currentStatus: ApplicationStatusType;
  onClose: () => void;
  onSuccess?: () => void;
  candidateName?: string;
  jobTitle?: string;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  applicationId,
  currentStatus,
  onClose,
  onSuccess,
  candidateName = 'داوطلب',
  jobTitle = 'موقعیت شغلی',
}) => {
  const [status, setStatus] = useState<ApplicationStatusType>(currentStatus);
  const dispatch = useDispatch<AppDispatch>();
  const [notes, setNotes] = useState('');
  const [showInterviewDetails, setShowInterviewDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    scheduledDate: '',
    duration: 60,
    location: '',
    meetingLink: '',
    notes: '',
  });

  const currentConfig = STATUS_FLOW[currentStatus];

  // Auto-show interview details when status is INTERVIEWING
  useEffect(() => {
    if (status === ApplicationStatus.INTERVIEWING) {
      setShowInterviewDetails(true);
      setIsExpanded(true);
    } else {
      setShowInterviewDetails(false);
      setIsExpanded(false);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicationId) {
      toast.error('شناسه درخواست الزامی است');
      return;
    }

    setIsLoading(true);

    try {
      const updateData: any = {
        status,
        notes: notes || undefined,
      };

      // Add interview details if status is INTERVIEWING
      if (status === ApplicationStatus.INTERVIEWING && showInterviewDetails) {
        updateData.interview = {
          scheduledDate: interviewDetails.scheduledDate,
          duration: interviewDetails.duration,
          location: interviewDetails.location || undefined,
          meetingLink: interviewDetails.meetingLink || undefined,
          notes: interviewDetails.notes || undefined,
        };
      }

      await dispatch(updateApplicationStatus({
        id: applicationId,
        data: updateData,
      })).unwrap();

      toast.success(`وضعیت درخواست به ${STATUS_FLOW[status]?.labelFa || status} تغییر یافت`);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'خطا در بروزرسانی وضعیت');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (statusValue: ApplicationStatusType) => {
    return STATUS_FLOW[statusValue]?.bgColor || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getStatusIcon = (statusValue: ApplicationStatusType) => {
    return STATUS_FLOW[statusValue]?.icon || AlertCircle;
  };

  const getStatusLabel = (statusValue: ApplicationStatusType): string => {
    return STATUS_FLOW[statusValue]?.labelFa || statusValue;
  };

  const StatusIcon = getStatusIcon(currentStatus);

  // Check if any required fields are missing for interview
  const isInterviewValid = () => {
    if (status !== ApplicationStatus.INTERVIEWING || !showInterviewDetails) {
      return true;
    }
    return !!interviewDetails.scheduledDate;
  };

  return (
    <Modal isOpen onClose={onClose} size="lg" className="max-w-3xl">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                بروزرسانی وضعیت درخواست
              </h3>
              <p className="flex text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {candidateName} • {jobTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isLoading}
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

          {/* Status Flow Visualizer */}
          <StatusFlowVisualizer
            currentStatus={currentStatus}
            targetStatus={status !== currentStatus ? status : undefined}
          />

          {/* Status Description */}
          <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentConfig?.descriptionFa}
            </p>
          </div>

          {/* Status Action Cards */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              انتخاب وضعیت جدید
            </label>
            <StatusActionCards
              currentStatus={currentStatus}
              onSelect={(newStatus) => setStatus(newStatus)}
              selectedStatus={status !== currentStatus ? status : undefined}
            />
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

          {/* Interview Details - shown when status is INTERVIEWING */}
          {status === ApplicationStatus.INTERVIEWING && (
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
                      required={status === ApplicationStatus.INTERVIEWING}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
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
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
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
                        className="w-full pr-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all text-right"
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
                        className="w-full pr-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all text-right"
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
              disabled={isLoading || !isInterviewValid()}
              className="w-full sm:w-auto gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال بروزرسانی...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  بروزرسانی وضعیت
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};