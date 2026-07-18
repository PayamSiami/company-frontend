// frontend-company/src/components/jobs/JobFilters.tsx
import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '../common/UI/Button';
import { Input } from '../common/UI/Input';

interface JobFiltersProps {
    onClose?: () => void;
    onApply?: (filters: any) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onClose, onApply }) => {
    const [filters, setFilters] = useState({
        status: '',
        jobType: '',
        workMode: '',
        experienceLevel: '',
        minSalary: '',
        maxSalary: '',
        location: '',
    });

    const handleApply = () => {
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '')
        );
        onApply?.(cleanedFilters);
        onClose?.();
    };

    const handleClear = () => {
        setFilters({
            status: '',
            jobType: '',
            workMode: '',
            experienceLevel: '',
            minSalary: '',
            maxSalary: '',
            location: '',
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="OPEN">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="CLOSED">Closed</option>
                        <option value="EXPIRED">Expired</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Job Type
                    </label>
                    <select
                        value={filters.jobType}
                        onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="FREELANCE">Freelance</option>
                        <option value="REMOTE">Remote</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Work Mode
                    </label>
                    <select
                        value={filters.workMode}
                        onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All</option>
                        <option value="REMOTE">Remote</option>
                        <option value="HYBRID">Hybrid</option>
                        <option value="ON_SITE">On-Site</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Experience Level
                    </label>
                    <select
                        value={filters.experienceLevel}
                        onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Levels</option>
                        <option value="ENTRY">Entry</option>
                        <option value="JUNIOR">Junior</option>
                        <option value="MID_LEVEL">Mid-Level</option>
                        <option value="SENIOR">Senior</option>
                        <option value="LEAD">Lead</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                    </label>
                    <Input
                        type="text"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        placeholder="City or country"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Salary Range
                    </label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={filters.minSalary}
                            onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                        />
                        <Input
                            type="number"
                            placeholder="Max"
                            value={filters.maxSalary}
                            onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" size="sm" onClick={handleClear}>
                    Clear All
                </Button>
                <Button variant="primary" size="sm" onClick={handleApply}>
                    Apply Filters
                </Button>
            </div>
        </div>
    );
};