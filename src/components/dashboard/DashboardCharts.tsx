// frontend-company/src/components/dashboard/DashboardCharts.tsx
import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    Briefcase,
    Calendar,
    Download,
    RefreshCw,
} from 'lucide-react';
import { Badge } from '../common/UI/Badge';
import { Button } from '../common/UI/Button';
import { cn } from '../../lib/utils';

// Type definitions
interface ChartDataPoint {
    label: string;
    value: number;
    secondaryValue?: number;
    color?: string;
}

interface DashboardChartsProps {
    className?: string;
    timeRange?: '7d' | '30d' | '90d' | '1y';
    onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void;
}

// Mock data
const mockApplicationData: ChartDataPoint[] = [
    { label: 'دوشنبه', value: 12, secondaryValue: 3 },
    { label: 'سه‌شنبه', value: 18, secondaryValue: 5 },
    { label: 'چهارشنبه', value: 15, secondaryValue: 4 },
    { label: 'پنج‌شنبه', value: 22, secondaryValue: 7 },
    { label: 'جمعه', value: 28, secondaryValue: 9 },
    { label: 'شنبه', value: 14, secondaryValue: 4 },
    { label: 'یکشنبه', value: 8, secondaryValue: 2 },
];

const mockJobData: ChartDataPoint[] = [
    { label: 'فروردین', value: 5, secondaryValue: 2 },
    { label: 'اردیبهشت', value: 8, secondaryValue: 4 },
    { label: 'خرداد', value: 12, secondaryValue: 6 },
    { label: 'تیر', value: 10, secondaryValue: 5 },
    { label: 'مرداد', value: 15, secondaryValue: 8 },
    { label: 'شهریور', value: 20, secondaryValue: 10 },
    { label: 'مهر', value: 18, secondaryValue: 9 },
    { label: 'آبان', value: 22, secondaryValue: 11 },
    { label: 'آذر', value: 25, secondaryValue: 13 },
    { label: 'دی', value: 20, secondaryValue: 10 },
    { label: 'بهمن', value: 28, secondaryValue: 14 },
    { label: 'اسفند', value: 32, secondaryValue: 16 },
];

const mockScoreData: ChartDataPoint[] = [
    { label: '۰-۲۰٪', value: 12, color: 'bg-red-500' },
    { label: '۲۰-۴۰٪', value: 18, color: 'bg-orange-500' },
    { label: '۴۰-۶۰٪', value: 25, color: 'bg-yellow-500' },
    { label: '۶۰-۸۰٪', value: 30, color: 'bg-blue-500' },
    { label: '۸۰-۱۰۰٪', value: 15, color: 'bg-green-500' },
];

// BarChart Component
const BarChart: React.FC<{
    data: ChartDataPoint[];
    title?: string;
    showSecondary?: boolean;
    height?: number;
    color?: string;
    secondaryColor?: string;
}> = ({
    data,
    title,
    showSecondary = false,
    height = 200,
    color = 'bg-blue-500',
    secondaryColor = 'bg-purple-400'
}) => {
        const maxValue = Math.max(...data.map(d => d.value), ...data.map(d => d.secondaryValue || 0));

        return (
            <div className="space-y-3" dir="rtl">
                {title && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            {showSecondary && (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    درخواست‌ها
                                </span>
                            )}
                            {showSecondary && (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                                    استخدام‌ها
                                </span>
                            )}
                        </div>
                    </div>
                )}
                <div className="flex items-end gap-1.5" style={{ height }}>
                    {data.map((item, index) => {
                        const heightPercent = (item.value / maxValue) * 100;
                        const secondaryHeight = item.secondaryValue
                            ? (item.secondaryValue / maxValue) * 100
                            : 0;

                        return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                                <div className="relative w-full flex flex-col items-center">
                                    {showSecondary && item.secondaryValue !== undefined && (
                                        <div
                                            className="w-full rounded-t transition-all duration-500 group-hover:opacity-80"
                                            style={{
                                                height: `${secondaryHeight}%`,
                                                backgroundColor: secondaryColor,
                                                minHeight: secondaryHeight > 0 ? '4px' : '0'
                                            }}
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "w-full rounded-t transition-all duration-500 group-hover:opacity-80",
                                            item.color || color
                                        )}
                                        style={{
                                            height: `${heightPercent}%`,
                                            minHeight: heightPercent > 0 ? '4px' : '0'
                                        }}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                        {item.label}: {item.value}
                                        {item.secondaryValue !== undefined && ` (${item.secondaryValue} استخدام)`}
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

// Main DashboardCharts Component
export const DashboardCharts: React.FC<DashboardChartsProps> = ({
    className = '',
    timeRange = '30d',
    onTimeRangeChange
}) => {
    const [activeTab, setActiveTab] = useState<'applications' | 'jobs' | 'scores'>('applications');

    const timeRanges = [
        { value: '7d', label: '۷ روز' },
        { value: '30d', label: '۳۰ روز' },
        { value: '90d', label: '۹۰ روز' },
        { value: '1y', label: '۱ سال' },
    ];

    const getChartData = () => {
        switch (activeTab) {
            case 'applications':
                return mockApplicationData;
            case 'jobs':
                return mockJobData;
            case 'scores':
                return mockScoreData;
            default:
                return mockApplicationData;
        }
    };

    const getChartTitle = () => {
        switch (activeTab) {
            case 'applications':
                return 'نمای کلی درخواست‌ها';
            case 'jobs':
                return 'نمای کلی آگهی‌های شغلی';
            case 'scores':
                return 'توزیع امتیازات هوش مصنوعی';
            default:
                return 'نمای کلی درخواست‌ها';
        }
    };

    const getChartConfig = () => {
        switch (activeTab) {
            case 'applications':
                return { showSecondary: true, color: 'bg-blue-500', secondaryColor: 'bg-purple-400' };
            case 'jobs':
                return { showSecondary: true, color: 'bg-green-500', secondaryColor: 'bg-emerald-400' };
            case 'scores':
                return { showSecondary: false, color: undefined, secondaryColor: undefined };
            default:
                return { showSecondary: true, color: 'bg-blue-500', secondaryColor: 'bg-purple-400' };
        }
    };

    const chartData = getChartData();
    const chartTitle = getChartTitle();
    const chartConfig = getChartConfig();

    return (
        <div className={cn("space-y-4", className)} dir="rtl">
            {/* Chart Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {['applications', 'jobs', 'scores'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                    activeTab === tab
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                {tab === 'applications' ? 'درخواست‌ها' :
                                    tab === 'jobs' ? 'مشاغل' :
                                    'امتیازات'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Time Range */}
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {timeRanges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => onTimeRangeChange?.(range.value as any)}
                                className={cn(
                                    "px-2 py-1 text-xs font-medium rounded transition-colors",
                                    timeRange === range.value
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>

                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <RefreshCw className="w-4 h-4 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="w-4 h-4 text-gray-400" />
                    </Button>
                </div>
            </div>

            {/* Chart */}
            <div className="pt-2">
                <BarChart
                    data={chartData}
                    title={chartTitle}
                    showSecondary={chartConfig.showSecondary}
                    color={chartConfig.color}
                    secondaryColor={chartConfig.secondaryColor}
                    height={activeTab === 'scores' ? 180 : 200}
                />
            </div>

            {/* Chart Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                        مجموع: {chartData.reduce((sum, d) => sum + d.value, 0)}
                    </span>
                    {activeTab === 'applications' && (
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            میانگین: {Math.round(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length)}
                        </span>
                    )}
                    {activeTab === 'jobs' && (
                        <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-green-500" />
                            کل مشاغل: {chartData.reduce((sum, d) => sum + d.value, 0)}
                        </span>
                    )}
                    {activeTab === 'scores' && (
                        <span className="flex items-center gap-1">
                            <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
                            توزیع: {chartData.length} بازه
                        </span>
                    )}
                </div>
                <Badge variant="gray" size="sm" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {timeRange === '7d' ? '۷ روز گذشته' :
                        timeRange === '30d' ? '۳۰ روز گذشته' :
                            timeRange === '90d' ? '۹۰ روز گذشته' : 'سال گذشته'}
                </Badge>
            </div>
        </div>
    );
};

export default DashboardCharts;