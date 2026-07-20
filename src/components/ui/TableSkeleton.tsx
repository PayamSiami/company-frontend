import React from 'react'

const TableSkeleton = () => { 
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            ))}
        </div>
    )
}

export default TableSkeleton