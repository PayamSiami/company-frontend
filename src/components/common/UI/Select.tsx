// frontend-company/src/components/common/UI/Select.tsx
import React, { forwardRef } from 'react';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
    placeholder?: string;
    containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            options,
            error = false,
            errorMessage,
            helperText,
            placeholder,
            containerClassName = '',
            className = '',
            id,
            value,
            defaultValue,
            ...props
        },
        ref
    ) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

        const hasValue = value !== undefined && value !== '' && value !== null;
        const hasDefaultValue = defaultValue !== undefined && defaultValue !== '';

        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `}
                    aria-invalid={error}
                    aria-describedby={errorMessage ? `${selectId}-error` : undefined}
                    value={value}
                    defaultValue={defaultValue}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled={!hasValue && !hasDefaultValue}>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && errorMessage && (
                    <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600">
                        {errorMessage}
                    </p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';