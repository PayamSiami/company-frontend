// frontend-company/src/components/candidates/CandidateList.tsx
import React, { useState, useMemo } from 'react';
import { CandidateCard } from './CandidateCard';
import { Pagination } from '../common/UI/Pagination';
import { Spinner } from '../common/UI/Spinner';
import {
    Users,
    Search,
    LayoutGrid,
    List as ListIcon,
    Download,
    UserPlus,
    Star,
} from 'lucide-react';
import { Button } from '../common/UI/Button';
import { Badge } from '../common/UI/Badge';
import { cn } from '../../lib/utils';

interface CandidateListProps {
    candidates: any[];
    loading?: boolean;
    shortlistedIds?: string[];
    onShortlistToggle?: (id: string) => void;
    searchTerm?: string;
    onSearch?: (term: string) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({
    candidates,
    loading = false,
    shortlistedIds = [],
    onShortlistToggle,
    searchTerm = '',
    onSearch,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'match'>('newest');
    const itemsPerPage = 12;

    // Filter and sort candidates
    const filteredCandidates = useMemo(() => {
        let filtered = candidates;

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(candidate =>
                candidate.fullName?.toLowerCase().includes(search) ||
                candidate.email?.toLowerCase().includes(search) ||
                candidate.skills?.some((s: string) => s.toLowerCase().includes(search)) ||
                candidate.location?.toLowerCase().includes(search)
            );
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'oldest':
                return [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            case 'name':
                return [...filtered].sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
            case 'match':
                return [...filtered].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
            default:
                return filtered;
        }
    }, [candidates, searchTerm, sortBy]);

    const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

    const shortlistedCount = shortlistedIds.length;

    if (loading && candidates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Spinner size="lg" />
                <p className="text-gray-500 dark:text-gray-400">Loading candidates...</p>
            </div>
        );
    }

    if (candidates.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <Users className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Candidates Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                    Start posting jobs to attract qualified candidates to your company.
                </p>
                <Button className="mt-4 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <UserPlus className="w-4 h-4" />
                    Post a Job
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {filteredCandidates.length} candidates
                        </span>
                    </div>
                    {shortlistedCount > 0 && (
                        <Badge variant="success" className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {shortlistedCount} shortlisted
                        </Badge>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
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
                            aria-label="Grid view"
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
                            aria-label="List view"
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="name">Name</option>
                        <option value="match">Match Score</option>
                    </select>

                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>
                </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>
                    Showing {filteredCandidates.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates
                </span>
                <span>
                    {Math.ceil(filteredCandidates.length / itemsPerPage)} pages
                </span>
            </div>

            {/* Candidate Cards */}
            <div className={cn(
                "grid gap-4",
                viewMode === 'grid'
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
            )}>
                {currentCandidates.map((candidate) => (
                    <CandidateCard
                        key={candidate._id}
                        candidate={candidate}
                        isShortlisted={shortlistedIds.includes(candidate._id)}
                        onShortlistToggle={() => onShortlistToggle?.(candidate._id)}
                        viewMode={viewMode}
                        matchScore={candidate.matchScore || 0}
                    />
                ))}
            </div>

            {/* Empty search results */}
            {filteredCandidates.length === 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-12 text-center">
                    <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No matching candidates</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Try adjusting your search or filters to find more candidates
                    </p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => onSearch?.('')}
                    >
                        Clear Search
                    </Button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredCandidates.length}
                        pageSize={itemsPerPage}
                        showFirstLast
                    />
                </div>
            )}
        </div>
    );
};