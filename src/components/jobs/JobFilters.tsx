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
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4" dir="rtl">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    فیلترها
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        وضعیت
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">همه وضعیت‌ها</option>
                        <option value="OPEN">فعال</option>
                        <option value="DRAFT">پیش‌نویس</option>
                        <option value="CLOSED">بسته شده</option>
                        <option value="EXPIRED">منقضی شده</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        نوع شغل
                    </label>
                    <select
                        value={filters.jobType}
                        onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">همه انواع</option>
                        <option value="FULL_TIME">تمام وقت</option>
                        <option value="PART_TIME">پاره وقت</option>
                        <option value="CONTRACT">قراردادی</option>
                        <option value="INTERNSHIP">کارآموزی</option>
                        <option value="FREELANCE">آزاد</option>
                        <option value="REMOTE">دورکاری</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        نوع همکاری
                    </label>
                    <select
                        value={filters.workMode}
                        onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">همه</option>
                        <option value="REMOTE">دورکاری</option>
                        <option value="HYBRID">ترکیبی</option>
                        <option value="ON_SITE">حضوری</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        سطح تجربه
                    </label>
                    <select
                        value={filters.experienceLevel}
                        onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">همه سطوح</option>
                        <option value="ENTRY">مبتدی</option>
                        <option value="JUNIOR">جونیور</option>
                        <option value="MID_LEVEL">متوسط</option>
                        <option value="SENIOR">ارشد</option>
                        <option value="LEAD">رهبر تیم</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        موقعیت مکانی
                    </label>
                    <Input
                        type="text"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        placeholder="شهر یا کشور"
                        className="text-right"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        محدوده حقوق
                    </label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="حداقل"
                            value={filters.minSalary}
                            onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                            className="text-right"
                        />
                        <Input
                            type="number"
                            placeholder="حداکثر"
                            value={filters.maxSalary}
                            onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                            className="text-right"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" size="sm" onClick={handleClear}>
                    پاک کردن همه
                </Button>
                <Button variant="primary" size="sm" onClick={handleApply}>
                    اعمال فیلترها
                </Button>
            </div>
        </div>
    );
};