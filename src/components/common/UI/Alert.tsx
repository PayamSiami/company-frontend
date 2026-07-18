// frontend-company/src/components/common/UI/Alert.tsx
import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    message?: string;
    onClose?: () => void;
    className?: string;
    children?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
    variant = 'info',
    title,
    message,
    onClose,
    className = '',
    children,
}) => {
    const variants = {
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: Info,
            iconColor: 'text-blue-400',
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: CheckCircle,
            iconColor: 'text-green-400',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: AlertTriangle,
            iconColor: 'text-yellow-400',
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: AlertCircle,
            iconColor: 'text-red-400',
        },
    };

    const { bg, border, text, icon: Icon, iconColor } = variants[variant];

    return (
        <div
            className={`
        flex items-start gap-3 p-4 border rounded-lg
        ${bg} ${border} ${text} ${className}
      `}
            role="alert"
        >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
                {title && <div className="font-medium">{title}</div>}
                {message && <div className="text-sm">{message}</div>}
                {children}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors`}
                    aria-label="Close alert"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};