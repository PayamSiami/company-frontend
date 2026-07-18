// frontend-company/src/components/applications/ApplicationFilters.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setFilters } from '../../store/slices/applications.slice';
import { ApplicationStatus } from '../../types';
import { Button } from '../common/UI/Button';
import { Input } from '../common/UI/Input';
import { Select } from '../common/UI/Select';
import {
  X,
  Filter,
  Search,
  SlidersHorizontal,
  Calendar,
  Star,
  Tag,
  RefreshCw,
  Check,
  Clock,
  Users,
} from 'lucide-react';

interface ApplicationFiltersProps {
  onApply?: (filters: any) => void;
  onClear?: () => void;
  onClose?: () => void;
  className?: string;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  onApply,
  onClear,
  className = '',
  onClose,
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [filters, setLocalFilters] = useState({
    status: '',
    jobId: '',
    minScore: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  });

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: ApplicationStatus.PENDING, label: 'Pending', icon: Clock },
    { value: ApplicationStatus.REVIEWING, label: 'Reviewing', icon: Users },
    { value: ApplicationStatus.SHORTLISTED, label: 'Shortlisted', icon: Star },
    { value: ApplicationStatus.REJECTED, label: 'Rejected', icon: X },
    { value: ApplicationStatus.INTERVIEW_SCHEDULED, label: 'Interview Scheduled', icon: Calendar },
    { value: ApplicationStatus.HIRED, label: 'Hired', icon: Check },
  ];

  const scoreOptions = [
    { value: '', label: 'Any Score' },
    { value: '0', label: '0%+' },
    { value: '20', label: '20%+' },
    { value: '40', label: '40%+' },
    { value: '60', label: '60%+' },
    { value: '80', label: '80%+' },
    { value: '90', label: '90%+' },
  ];

  const handleChange = (field: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    const cleanedFilters: any = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (key === 'minScore') {
          cleanedFilters[key] = parseInt(value);
        } else {
          cleanedFilters[key] = value;
        }
      }
    });

    dispatch(setFilters(cleanedFilters));
    if (onApply) onApply(cleanedFilters);
    closePanel();
  };

  const handleClear = () => {
    setLocalFilters({
      status: '',
      jobId: '',
      minScore: '',
      dateFrom: '',
      dateTo: '',
      search: '',
    });
    dispatch(setFilters({}));
    if (onClear) onClear();
    closePanel();
  };

  const togglePanel = () => {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  };

  const openPanel = () => {
    setIsOpen(true);
    setIsAnimating(true);
  };

  const closePanel = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 200);
    if (onClose)
      onClose()
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closePanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closePanel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className={`
          flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
          ${isOpen
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
        `}
        aria-expanded={isOpen}
        aria-label="Toggle filters"
      >
        <Filter className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-blue-500 rounded-full">
            {activeFilterCount}
          </span>
        )}
        <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
      </button>

      {/* Filters Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className={`
            absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 z-50 overflow-hidden
            transition-all duration-200 transform origin-top-right
            ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Filter Applications
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              {activeFilterCount > 0 && (
                <span className="text-xs text-gray-400">
                  {activeFilterCount} active
                </span>
              )}
              <button
                onClick={closePanel}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleChange('search', e.target.value)}
                  placeholder="Search by name or job title..."
                  className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Status
              </label>
              <Select
                value={filters.status}
                onChange={(e) => handleChange('status', e.target.value)}
                options={statusOptions}
                className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>

            {/* Min Score */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Minimum AI Score
              </label>
              <Select
                value={filters.minScore}
                onChange={(e) => handleChange('minScore', e.target.value)}
                options={scoreOptions}
                className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleChange('dateFrom', e.target.value)}
                    className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleChange('dateTo', e.target.value)}
                    className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters Preview */}
            {activeFilterCount > 0 && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Active filters:</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || value === '') return null;
                    const label = key === 'status'
                      ? statusOptions.find(o => o.value === value)?.label
                      : key === 'minScore'
                        ? `${value}%+`
                        : key === 'search'
                          ? `"${value}"`
                          : value;
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg"
                      >
                        <Tag className="w-3 h-3" />
                        {label}
                        <button
                          onClick={() => handleChange(key, '')}
                          className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex-1 gap-1.5 justify-center"
              disabled={activeFilterCount === 0}
            >
              <RefreshCw className="w-4 h-4" />
              Clear All
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApply}
              className="flex-1 gap-1.5 justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Check className="w-4 h-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};