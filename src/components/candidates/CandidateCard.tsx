// frontend-company/src/components/candidates/CandidateCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Mail, 
  Phone,
  Calendar,
  Clock,
  Zap,
  Eye,
  MessageSquare,
  CheckCircle,
  MoreVertical,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/UI/Badge';
import { Button } from '../common/UI/Button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../common/UI/DropdownMenu';
import { cn } from '../../lib/utils';

interface CandidateCardProps {
  candidate: any;
  isShortlisted?: boolean;
  onShortlistToggle?: () => void;
  viewMode?: 'grid' | 'list';
  matchScore?: number;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isShortlisted = false,
  onShortlistToggle,
  viewMode = 'grid',
  matchScore = 0,
}) => {
  const topSkills = candidate.skills?.slice(0, 6) || [];
  const remainingSkills = candidate.skills?.length - 6 || 0;

  const getMatchScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-50 dark:bg-green-900/20';
    if (score >= 40) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString();
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        <div className="flex flex-wrap items-start gap-4">
          {/* Avatar & Info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-blue-500/25">
                {candidate.fullName?.charAt(0) || 'C'}
              </div>
              {isShortlisted && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/candidates/${candidate._id}`} className="hover:underline">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {candidate.fullName || 'Unknown'}
                  </h3>
                </Link>
                {isShortlisted && (
                  <Badge variant="success" size="sm" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Shortlisted
                  </Badge>
                )}
                {matchScore > 0 && (
                  <Badge 
                    variant="info" 
                    size="sm" 
                    className={cn("flex items-center gap-1", getMatchScoreBg(matchScore))}
                  >
                    <Zap className="w-3 h-3" />
                    {matchScore}% Match
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                {candidate.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[150px]">{candidate.email}</span>
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{candidate.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant={isShortlisted ? 'success' : 'outline'}
              size="sm"
              onClick={onShortlistToggle}
              className="flex items-center gap-1.5"
            >
              <Star className={cn("h-4 w-4", isShortlisted && "fill-current")} />
              {isShortlisted ? 'Shortlisted' : 'Shortlist'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Skills */}
        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {topSkills.map((skill: string, idx: number) => (
              <Badge key={idx} variant="gray" size="sm" className="text-xs">
                {skill}
              </Badge>
            ))}
            {remainingSkills > 0 && (
              <Badge variant="gray" size="sm" className="text-xs">
                +{remainingSkills} more
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  }

  // Grid view layout (default)
  return (
    <div 
      className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              {candidate.fullName?.charAt(0) || 'C'}
            </div>
            {isShortlisted && (
              <div className="absolute -top-1 -right-1">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>

          <div>
            <Link to={`/candidates/${candidate._id}`} className="hover:underline">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {candidate.fullName || 'Unknown'}
              </h3>
            </Link>
            {candidate.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                {candidate.location}
              </div>
            )}
          </div>
        </div>

        {matchScore > 0 && (
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-semibold",
            getMatchScoreBg(matchScore),
            getMatchScoreColor(matchScore)
          )}>
            <Sparkles className="h-3.5 w-3.5" />
            {matchScore}%
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
        {candidate.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{candidate.email}</span>
          </div>
        )}
        {candidate.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <span>{candidate.phone}</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-sm">
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <Briefcase className="h-3.5 w-3.5" />
          <span>{candidate.experience?.length || 0} roles</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>{candidate.education?.length || 0} degrees</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 ml-auto">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(candidate.createdAt)}</span>
        </div>
      </div>

      {/* Skills */}
      {topSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          {topSkills.map((skill: string, idx: number) => (
            <Badge key={idx} variant="gray" size="sm" className="text-xs">
              {skill}
            </Badge>
          ))}
          {remainingSkills > 0 && (
            <Badge variant="gray" size="sm" className="text-xs">
              +{remainingSkills}
            </Badge>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <Button
          variant={isShortlisted ? 'success' : 'outline'}
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onShortlistToggle?.();
          }}
          className={cn(
            "flex-1 gap-1.5 transition-all",
            isShortlisted && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          )}
        >
          <Star className={cn("h-4 w-4", isShortlisted && "fill-current")} />
          {isShortlisted ? 'Shortlisted' : 'Shortlist'}
        </Button>
        <Link to={`/candidates/${candidate._id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </Link>
        <Button variant="ghost" size="sm" className="p-2 h-9 w-9">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};