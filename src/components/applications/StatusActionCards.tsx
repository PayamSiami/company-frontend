// frontend-company/src/components/applications/StatusActionCards.tsx
import React from 'react';
import { ApplicationStatus } from '../../types';
import { STATUS_FLOW } from '../../config/statusFlow';
import { cn } from '../../lib/utils';
import {
    UserMinus,
    Calendar,
    Star,
    Eye,
    ArrowRight,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';

interface StatusActionCardsProps {
    currentStatus: ApplicationStatus;
    onSelect: (status: ApplicationStatus) => void;
    selectedStatus?: ApplicationStatus;
    className?: string;
}

export const StatusActionCards: React.FC<StatusActionCardsProps> = ({
    currentStatus,
    onSelect,
    selectedStatus,
    className,
}) => {
    const config = STATUS_FLOW[currentStatus];
    const nextStatuses = config?.nextStatuses || [];

    if (nextStatuses.length === 0) {
        return (
            <div className={cn("text-center py-6", className)}>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        این وضعیت نهایی است و نمی‌توان آن را تغییر داد
                    </p>
                </div>
            </div>
        );
    }

    const getActionConfig = (status: ApplicationStatus) => {
        const configs: Record<ApplicationStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
            [ApplicationStatus.PENDING]: {
                icon: Clock,
                color: 'text-yellow-600 dark:text-yellow-400',
                bg: 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
                label: 'شروع بررسی',
            },
            [ApplicationStatus.REVIEWING]: {
                icon: Eye,
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
                label: 'ادامه بررسی',
            },
            [ApplicationStatus.SHORTLISTED]: {
                icon: Star,
                color: 'text-green-600 dark:text-green-400',
                bg: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30',
                label: 'انتخاب برای مرحله بعد',
            },
            [ApplicationStatus.INTERVIEWING]: {
                icon: Calendar,
                color: 'text-purple-600 dark:text-purple-400',
                bg: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
                label: 'برنامه‌ریزی مصاحبه',
            },
            [ApplicationStatus.HIRED]: {
                icon: CheckCircle,
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
                label: 'تایید استخدام',
            },
            [ApplicationStatus.REJECTED]: {
                icon: XCircle,
                color: 'text-red-600 dark:text-red-400',
                bg: 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30',
                label: 'رد درخواست',
            },
            [ApplicationStatus.WITHDRAWN]: {
                icon: UserMinus,
                color: 'text-gray-600 dark:text-gray-400',
                bg: 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70',
                label: 'انصراف داوطلب',
            },
        };
        return configs[status] || {
            icon: ArrowRight,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
            label: 'تغییر وضعیت'
        };
    };

    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", className)}>
            {nextStatuses.map((status) => {
                const action = getActionConfig(status);
                const Icon = action.icon;
                const isSelected = selectedStatus === status;

                return (
                    <button
                        key={status}
                        onClick={() => onSelect(status)}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-right",
                            isSelected
                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                            action.bg
                        )}
                    >
                        <div className={cn("p-2 rounded-lg", isSelected ? "bg-blue-100 dark:bg-blue-900/30" : action.bg)}>
                            <Icon className={cn("h-5 w-5", action.color)} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {STATUS_FLOW[status]?.labelFa || status}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {action.label}
                            </p>
                        </div>
                        {isSelected && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};