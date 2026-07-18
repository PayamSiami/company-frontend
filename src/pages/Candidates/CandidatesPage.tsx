// frontend-company/src/pages/Candidates/Index.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  fetchCandidates,
  shortlistCandidate,
  unshortlistCandidate,
  fetchCandidateStats
} from '../../store/slices/candidates.slice';
import { CandidateList } from '../../components/candidates/CandidateList';
import { Button } from '../../components/common/UI/Button';
import { Badge } from '../../components/common/UI/Badge';
import { Tabs, TabsList, TabsTrigger } from '../../components/common/UI/Tabs';
import {
  Download,
  Users,
  UserPlus,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Star,
  Clock,
  Activity,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { useAppDispatch } from '../../store/hooks';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'name' | 'skills' | 'applications';

const CandidatesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { candidates, isLoading, shortlistedIds } = useSelector(
    (state: RootState) => state.candidates
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'all' | 'shortlisted' | 'new'>('all');

  useEffect(() => {
    dispatch(fetchCandidates());
    dispatch(fetchCandidateStats());
  }, [dispatch]);

  const handleExport = () => {
    toast.success('Candidates exported successfully!');
  };

  const handleShortlistToggle = async (candidateId: string) => {
    if (shortlistedIds.includes(candidateId)) {
      await dispatch(unshortlistCandidate(candidateId));
      toast.info('Candidate removed from shortlist');
    } else {
      await dispatch(shortlistCandidate(candidateId));
      toast.success('Candidate shortlisted!');
    }
  };

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidates;

    // Tab filter
    if (activeTab === 'shortlisted') {
      filtered = filtered.filter(c => shortlistedIds.includes(c._id));
    } else if (activeTab === 'new') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(c => new Date(c.createdAt) >= weekAgo);
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.fullName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.skills?.some((s: string) => s.toLowerCase().includes(term)) ||
        c.location?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [candidates, activeTab, searchTerm, sortBy, sortOrder, shortlistedIds]);

  console.log(candidates)

  const tabs = [
    { value: 'all', label: 'All', icon: Users, count: candidates.length },
    { value: 'shortlisted', label: 'Shortlisted', icon: Star, count: shortlistedIds.length },
    {
      value: 'new', label: 'New', icon: Clock, count: candidates.filter(c => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(c.createdAt) >= weekAgo;
      }).length
    },
  ];

  if (isLoading && candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Candidates
                <Badge variant="info" size="sm" className="ml-2">
                  <Activity className="w-3 h-3 mr-1" />
                  {candidates.length} total
                </Badge>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                Manage and track candidate profiles
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Navigate to add candidate */ }}
            className="gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            Add Candidate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Candidates</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{candidates.length}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">active profiles</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
          <p className="text-sm text-gray-500 dark:text-gray-400">Shortlisted</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{shortlistedIds.length}</p>
          <p className="text-xs text-green-600 dark:text-green-400">
            {candidates.length > 0 ? Math.round((shortlistedIds.length / candidates.length) * 100) : 0}% of total
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
          <p className="text-sm text-gray-500 dark:text-gray-400">New This Week</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {candidates.filter(c => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(c.createdAt) >= weekAgo;
            }).length}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">new profiles</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-4 hover:shadow-md transition-all">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Skills</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {candidates.length > 0
              ? Math.round(candidates.reduce((sum, c) => sum + (c.skills?.length || 0), 0) / candidates.length)
              : 0}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400">per candidate</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Tabs */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <TabsList className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <Badge variant="gray" size="sm" className="ml-0.5">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidates..."
              className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-40 md:w-56"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name</option>
            <option value="skills">Skills</option>
            <option value="applications">Applications</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'grid'
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'list'
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Candidate List */}
      <CandidateList
        candidates={filteredCandidates}
        loading={isLoading}
        shortlistedIds={shortlistedIds}
        onShortlistToggle={handleShortlistToggle}
        searchTerm={searchTerm}
      />

      {/* Empty State */}
      {filteredCandidates.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Users className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No candidates found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {searchTerm || activeTab !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start posting jobs to attract candidates'}
          </p>
          {(searchTerm || activeTab !== 'all') && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setActiveTab('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;