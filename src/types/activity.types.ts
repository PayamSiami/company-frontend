// frontend-company/src/types/activity.types.ts

export type ActivityType =
  | 'generation'
  | 'job'
  | 'application'
  | 'shortlist'
  | 'interview'
  | 'candidate'
  | 'ai';

export type ActivityStatus = 'pending' | 'completed' | 'in-progress' | 'rejected';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  score: number | null;
  timestamp: string;
  status: ActivityStatus;
  /** Human-readable time from the API, e.g. "3 hours ago" */
  time: string;
  link?: string;
  jobTitle?: string;
  metadata?: {
    jobId?: string;
    isActive?: boolean;
  };
}

export interface ActivityPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}