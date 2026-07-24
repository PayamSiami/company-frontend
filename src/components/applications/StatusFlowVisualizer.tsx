// frontend-company/src/components/applications/StatusFlowVisualizer.tsx
import React from 'react';
import { ApplicationStatus } from '../../types';
import { STATUS_FLOW } from '../../config/statusFlow';
import { cn } from '../../lib/utils';
import {
    ChevronRight,
    CheckCircle2,
    XCircle,
    Clock,
    UserMinus,
    Star,
    Calendar,
    Eye,
    Users,
    UserCheck
} from 'lucide-react';

interface StatusFlowVisualizerProps {
    currentStatus: ApplicationStatus;
    targetStatus?: ApplicationStatus;
    className?: string;
    onStatusClick?: (status: ApplicationStatus) => void;
}

export const StatusFlowVisualizer: React.FC<StatusFlowVisualizerProps> = ({
    currentStatus,
    targetStatus,
    className,
    onStatusClick,
}) => {
    const currentConfig = STATUS_FLOW[currentStatus];
    const nextStatuses = currentConfig?.nextStatuses || [];

    // Build the full flow path
    const buildFlowPath = (): ApplicationStatus[] => {
        const path: ApplicationStatus[] = [currentStatus];
        let current = currentStatus;

        // If target is provided, build path to target
        if (targetStatus) {
            while (current !== targetStatus) {
                const next = STATUS_FLOW[current]?.nextStatuses?.[0];
                if (!next) break;
                path.push(next);
                current = next;
            }
        } else {
            // Show current and immediate next statuses
            path.push(...nextStatuses.slice(0, 2));
        }

        return path;
    };

    const flowPath = buildFlowPath();

    return (
        <div className={cn("space-y-4", className)}>
            {/* Progress Bar */}
            <div className="relative">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">پیشرفت بررسی</span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {currentConfig?.progress || 0}%
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${currentConfig?.progress || 0}%` }}
                    />
                </div>
            </div>

            {/* Flow Steps */}
            <div className="flex items-center gap-1 py-2 px-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl overflow-x-auto">
                {flowPath.map((status, index) => {
                    const config = STATUS_FLOW[status];
                    const Icon = config?.icon;
                    const isCurrent = status === currentStatus;
                    const isTarget = status === targetStatus;
                    const isLast = index === flowPath.length - 1;

                    return (
                        <React.Fragment key={status}>
                            <button
                                onClick={() => onStatusClick?.(status)}
                                className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                                    isCurrent && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 bg-blue-50 dark:bg-blue-900/30",
                                    isTarget && "ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900 bg-green-50 dark:bg-green-900/30",
                                    !isCurrent && !isTarget && config?.bgColor,
                                    config?.textColor
                                )}
                            >
                                {Icon && <Icon className="h-3.5 w-3.5" />}
                                <span>{config?.labelFa}</span>
                                {isCurrent && (
                                    <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                                        فعلی
                                    </span>
                                )}
                                {isTarget && (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                )}
                            </button>
                            {!isLast && (
                                <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};