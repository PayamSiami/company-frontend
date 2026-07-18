// frontend-company/src/components/dashboard/DashboardStats.tsx
import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { ProgressBar } from '../common/UI/ProgressBar';
import { Badge } from '../common/UI/Badge';
import { cn } from '../../lib/utils';
import type { DashboardStatsDto } from '../../types';

interface DashboardStatsProps {
  stats: DashboardStatsDto;
  className?: string;
  showTrends?: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  gradient?: string;
  subtitle?: string;
  trend?: number;
  progress?: number;
  badge?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  gradient,
  subtitle,
  trend,
  progress,
  badge,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 transition-all duration-300",
        onClick && "cursor-pointer hover:shadow-xl hover:-translate-y-1",
        isHovered && "shadow-xl"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none",
        gradient || `bg-${color}`
      )} />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {badge && (
            <Badge variant="info" size="sm" className="shrink-0">
              {badge}
            </Badge>
          )}
        </div>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="mt-3">
            <ProgressBar
              value={progress}
              max={100}
              className="h-1.5"
              color={color as any}
            />
          </div>
        )}

        {/* Trend indicator */}
        {trend !== undefined && trend !== 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}>
              {trend > 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              vs last month
            </span>
          </div>
        )}

        {/* Hover shine effect */}
        <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ transform: 'translateX(-100%)', animation: 'shine 1.5s ease-in-out' }} />
        </div>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  className = '',
  showTrends = true
}) => {
  // Calculate some additional metrics
  const applicationToJobRatio = stats.totalJobs > 0
    ? (stats.totalApplications / stats.totalJobs).toFixed(1)
    : '0';

  const shortlistRate = stats.totalApplications > 0
    ? (stats.shortlistedCandidates / stats.totalApplications) * 100
    : 0;

  // Trend data (mock - in real app this would come from API)
  const trends = {
    totalJobs: 8,
    totalApplications: 12,
    shortlisted: -2,
    screeningCoverage: 5,
  };

  const cards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      color: 'bg-blue-500',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      subtitle: `${stats.activeJobs} active positions`,
      trend: showTrends ? trends.totalJobs : undefined,
      onClick: () => console.log('Navigate to jobs'),
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      color: 'bg-purple-500',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      subtitle: `${stats.pendingApplications} pending review`,
      trend: showTrends ? trends.totalApplications : undefined,
      badge: `${applicationToJobRatio}/job`,
      onClick: () => console.log('Navigate to applications'),
    },
    {
      title: 'Shortlisted',
      value: stats.shortlistedCandidates,
      color: 'bg-green-500',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      subtitle: `${shortlistRate.toFixed(1)}% of applications`,
      trend: showTrends ? trends.shortlisted : undefined,
      onClick: () => console.log('Navigate to shortlisted'),
    },
    {
      title: 'AI Screening Coverage',
      value: `${Math.round(stats.screeningCoverage)}%`,
      color: 'bg-indigo-500',
      gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
      subtitle: `${stats.aiScreenedCount} candidates screened`,
      progress: stats.screeningCoverage,
      trend: showTrends ? trends.screeningCoverage : undefined,
      badge: <Sparkles className="w-3 h-3" />,
      onClick: () => console.log('Navigate to AI screening'),
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card: any, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};