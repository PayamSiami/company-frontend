// frontend-company/src/components/common/UI/Tabs.tsx
import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../../lib/utils';

// ==================== Types ====================

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider');
    }
    return context;
};

// ==================== Tabs Root ====================

interface TabsProps {
    children: React.ReactNode;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    children,
    defaultValue = '',
    value: controlledValue,
    onValueChange,
    className = '',
}) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = (newValue: string) => {
        if (!isControlled) {
            setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div className={cn("w-full", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

// ==================== TabsList ====================

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
    return (
        <div
            className={cn(
                "inline-flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400",
                className
            )}
            role="tablist"
        >
            {children}
        </div>
    );
};

// ==================== TabsTrigger ====================

interface TabsTriggerProps {
    children: React.ReactNode;
    value: string;
    className?: string;
    disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
    children,
    value,
    className = '',
    disabled = false,
}) => {
    const { value: selectedValue, onValueChange } = useTabs();
    const isActive = selectedValue === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => !disabled && onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                className
            )}
        >
            {children}
        </button>
    );
};

// ==================== TabsContent ====================

interface TabsContentProps {
    children: React.ReactNode;
    value: string;
    className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
    children,
    value,
    className = '',
}) => {
    const { value: selectedValue } = useTabs();
    const isActive = selectedValue === value;

    if (!isActive) return null;

    return (
        <div
            role="tabpanel"
            className={cn(
                "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
        >
            {children}
        </div>
    );
};