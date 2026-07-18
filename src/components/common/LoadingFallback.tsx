// frontend-company/src/components/common/LoadingFallback.tsx
import React from 'react';
import { Spinner } from './UI/Spinner';

interface LoadingFallbackProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
    message = 'Loading...',
    size = 'lg',
    fullScreen = true,
}) => {
    const containerClasses = fullScreen
        ? 'min-h-screen flex items-center justify-center bg-gray-50'
        : 'flex items-center justify-center p-8';

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <Spinner size={size} />
                <p className="mt-4 text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default LoadingFallback;