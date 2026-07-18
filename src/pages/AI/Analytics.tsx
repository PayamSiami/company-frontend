// frontend-company/src/pages/AI/Analytics.tsx
import React, { useState } from 'react';
import { Card } from '../../components/common/UI/Card';
import { Badge } from '../../components/common/UI/Badge';
import { Button } from '../../components/common/UI/Button';
import { ProgressBar } from '../../components/common/UI/ProgressBar';
import {
  TrendingUp,
  Users,
  Clock,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Zap,
  Brain,
  Activity,
  Eye,
  Download,
  Share2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  bg,
  description,
  trend = change.startsWith('+') ? 'up' : 'down',
  onClick
}) => {
  const isPositive = trend === 'up';
  
  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "p-2.5 rounded-xl transition-transform group-hover:scale-105",
          bg
        )}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <span className={cn(
          "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
          isPositive 
            ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20" 
            : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
        )}>
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

const AIAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const metrics = [
    {
      title: 'Hiring Efficiency',
      value: '78%',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      description: '12% faster than last month'
    },
    {
      title: 'Candidate Quality',
      value: '4.2/5',
      change: '+0.3',
      icon: Award,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Based on 156 reviews'
    },
    {
      title: 'Time to Hire',
      value: '12 days',
      change: '-3 days',
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Industry avg: 18 days'
    },
    {
      title: 'AI Accuracy',
      value: '89%',
      change: '+5%',
      icon: Sparkles,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      description: '95% confidence rate'
    }
  ];

  const screeningStats = {
    total: 1250,
    high: 380,
    medium: 520,
    low: 350,
    accuracy: 89,
    avgScore: 72
  };

  const hiringFunnel = [
    { stage: 'Applied', count: 1250, percentage: 100 },
    { stage: 'AI Screened', count: 1050, percentage: 84 },
    { stage: 'Shortlisted', count: 380, percentage: 30 },
    { stage: 'Interviewed', count: 180, percentage: 14 },
    { stage: 'Hired', count: 45, percentage: 3.6 },
  ];


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                AI Analytics
                <Badge variant="info" size="sm" className="ml-2">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                Insights into your AI-powered hiring process
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                  timeRange === range
                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Screening Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              Screening Score Distribution
            </h3>
            <Badge variant="gray" size="sm">
              {screeningStats.total} total
            </Badge>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-600 dark:text-green-400">High (70%+)</span>
                <span className="font-medium">{screeningStats.high}</span>
              </div>
              <ProgressBar 
                value={(screeningStats.high / screeningStats.total) * 100} 
                max={100} 
                className="h-2"
                color="green"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-yellow-600 dark:text-yellow-400">Medium (40-69%)</span>
                <span className="font-medium">{screeningStats.medium}</span>
              </div>
              <ProgressBar 
                value={(screeningStats.medium / screeningStats.total) * 100} 
                max={100} 
                className="h-2"
                color="yellow"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-600 dark:text-red-400">Low (&lt;40%)</span>
                <span className="font-medium">{screeningStats.low}</span>
              </div>
              <ProgressBar 
                value={(screeningStats.low / screeningStats.total) * 100} 
                max={100} 
                className="h-2"
                color="red"
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Average Score: <span className="font-semibold text-gray-900 dark:text-white">{screeningStats.avgScore}%</span></span>
            <span>Accuracy: <span className="font-semibold text-gray-900 dark:text-white">{screeningStats.accuracy}%</span></span>
          </div>
        </Card>

        {/* Hiring Funnel */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Hiring Funnel
            </h3>
            <Badge variant="gray" size="sm">
              {hiringFunnel[0].count} total
            </Badge>
          </div>
          <div className="space-y-3">
            {hiringFunnel.map((stage, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{stage.stage}</span>
                  <span className="font-medium">{stage.count} ({stage.percentage}%)</span>
                </div>
                <ProgressBar 
                  value={stage.percentage} 
                  max={100} 
                  className="h-2"
                  color={idx === 0 ? 'blue' : idx === hiringFunnel.length - 1 ? 'green' : 'gray'}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Performance Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            AI Performance Metrics
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              System Active
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Screenings</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,247</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 12% this month</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Processing Time</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2.4s</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">↓ 18% faster</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400">Prediction Accuracy</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">89%</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 5% improvement</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400">Jobs with AI</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">48</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">78% of total jobs</p>
          </div>
        </div>

        {/* Performance History (placeholder) */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-500 dark:text-gray-400">Performance History</span>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <div className="flex items-end gap-2 h-24">
            {Array.from({ length: 12 }).map((_, i) => {
              const height = 20 + Math.random() * 80;
              const isHigh = height > 70;
              const isLow = height < 30;
              return (
                <div 
                  key={i}
                  className={cn(
                    "flex-1 rounded-t transition-all duration-500",
                    isHigh ? "bg-green-400 dark:bg-green-500" : 
                    isLow ? "bg-red-400 dark:bg-red-500" : 
                    "bg-blue-400 dark:bg-blue-500"
                  )}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
      </Card>

      {/* Insights Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-green-500" />
            System active
          </span>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            Share Report
          </button>
          <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
            <Eye className="w-3 h-3" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsPage;