// src/components/ui/Accordion.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

// ==================== Types ====================

interface AccordionContextType {
    type: 'single' | 'multiple';
    value: string | string[];
    onValueChange: (value: string | string[]) => void;
    collapsible?: boolean;
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'single' | 'multiple';
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    collapsible?: boolean;
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

// ==================== Context ====================

const AccordionContext = createContext<AccordionContextType | null>(null);

const useAccordionContext = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error('Accordion components must be used within an Accordion');
    }
    return context;
};

const useAccordionItemContext = (itemValue: string) => {
    const context = useAccordionContext();
    const { type, value, onValueChange, collapsible } = context;

    const isSelected = type === 'single'
        ? value === itemValue
        : Array.isArray(value) && value.includes(itemValue);

    const toggleItem = useCallback(() => {
        if (type === 'single') {
            if (isSelected && collapsible) {
                onValueChange('');
            } else if (!isSelected) {
                onValueChange(itemValue);
            }
        } else {
            if (Array.isArray(value)) {
                const newValue = isSelected
                    ? value.filter((v) => v !== itemValue)
                    : [...value, itemValue];
                onValueChange(newValue);
            }
        }
    }, [type, isSelected, collapsible, onValueChange, itemValue, value]);

    return { isSelected, toggleItem };
};

// ==================== Main Components ====================

export const Accordion: React.FC<AccordionProps> = ({
    type = 'single',
    value: controlledValue,
    defaultValue = type === 'single' ? '' : [],
    onValueChange,
    collapsible = true,
    className,
    children,
    ...props
}) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(defaultValue);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = useCallback(
        (newValue: string | string[]) => {
            if (!isControlled) {
                setUncontrolledValue(newValue);
            }
            onValueChange?.(newValue);
        },
        [isControlled, onValueChange]
    );

    return (
        <AccordionContext.Provider
            value={{
                type,
                value: currentValue,
                onValueChange: handleValueChange,
                collapsible,
            }}
        >
            <div
                className={cn('divide-y divide-gray-200 dark:divide-gray-800', className)}
                {...props}
            >
                {children}
            </div>
        </AccordionContext.Provider>
    );
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
    value,
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn('border-b border-gray-200 dark:border-gray-800 last:border-0', className)}
            data-value={value}
            {...props}
        >
            {children}
        </div>
    );
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
    children,
    className,
    ...props
}) => {
    const { value } = useAccordionContext();
    const itemValue = value as string;
    const { isSelected, toggleItem } = useAccordionItemContext(itemValue);

    return (
        <button
            type="button"
            onClick={toggleItem}
            className={cn(
                'flex w-full items-center justify-between py-4 px-4 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 [&[data-state=open]>svg]:rotate-180',
                isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400',
                className
            )}
            data-state={isSelected ? 'open' : 'closed'}
            aria-expanded={isSelected}
            {...props}
        >
            {children}
            <ChevronDown
                className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-200',
                    isSelected ? 'rotate-180' : ''
                )}
            />
        </button>
    );
};

export const AccordionContent: React.FC<AccordionContentProps> = ({
    children,
    className,
    ...props
}) => {
    const { value } = useAccordionContext();
    const itemValue = value as string;
    const { isSelected } = useAccordionItemContext(itemValue);
    const [height, setHeight] = useState<number>(0);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        }
    }, [children]);

    return (
        <div
            ref={contentRef}
            className={cn(
                'overflow-hidden transition-all duration-200 ease-in-out',
                isSelected ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            )}
            style={{
                maxHeight: isSelected ? height : 0,
            }}
            {...props}
        >
            <div className={cn('pb-4 px-4 text-sm text-gray-600 dark:text-gray-400', className)}>
                {children}
            </div>
        </div>
    );
};

// ==================== Sub-components for simpler imports ====================

const AccordionComponent = Object.assign(Accordion, {
    Item: AccordionItem,
    Trigger: AccordionTrigger,
    Content: AccordionContent,
});

export default AccordionComponent;

// Export all components
export { Accordion as Root, AccordionItem as Item, AccordionTrigger as Trigger, AccordionContent as Content };