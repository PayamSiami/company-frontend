// frontend-company/src/components/common/UI/DropdownMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

interface DropdownMenuContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

const useDropdownMenu = () => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) {
        throw new Error('useDropdownMenu must be used within a DropdownMenu');
    }
    return context;
};

// ==================== DropdownMenu Root ====================

interface DropdownMenuProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
    children,
    open: controlledOpen,
    onOpenChange,
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = (newOpen: boolean) => {
        if (!isControlled) {
            setUncontrolledOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    };

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
            <div className="relative inline-block">
                {children}
            </div>
        </DropdownMenuContext.Provider>
    );
};

// ==================== DropdownMenuTrigger ====================

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    asChild?: boolean;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
    children,
    className,
    asChild = false,
    ...props
}) => {
    const { open, setOpen, triggerRef } = useDropdownMenu();

    const handleClick = () => {
        setOpen(!open);
    };

    if (asChild) {
        return (
            <div onClick={handleClick} className="cursor-pointer">
                {children}
            </div>
        );
    }

    return (
        <button
            ref={triggerRef}
            type="button"
            onClick={handleClick}
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                className
            )}
            aria-expanded={open}
            {...props}
        >
            {children}
        </button>
    );
};

// ==================== DropdownMenuContent ====================

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    className?: string;
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
    children,
    align = 'center',
    sideOffset = 8,
    className,
    ...props
}) => {
    const { open, setOpen, triggerRef } = useDropdownMenu();
    const contentRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                contentRef.current &&
                !contentRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, setOpen, triggerRef]);

    // Close on escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open, setOpen]);

    if (!open) return null;

    const alignClasses = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0',
    };

    return (
        <div
            ref={contentRef}
            className={cn(
                "absolute z-50 min-w-32 overflow-hidden rounded-md border bg-white dark:bg-gray-900 p-1 shadow-lg animate-fade-in",
                alignClasses[align],
                className
            )}
            style={{ top: `calc(100% + ${sideOffset}px)` }}
            {...props}
        >
            {children}
        </div>
    );
};

// ==================== DropdownMenuItem ====================

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    inset?: boolean;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
    children,
    className,
    inset = false,
    ...props
}) => {
    const { setOpen } = useDropdownMenu();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(false);
        props.onClick?.(e);
    };

    return (
        <button
            className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 w-full",
                inset && "pl-8",
                className
            )}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
};

// ==================== DropdownMenuLabel ====================

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    inset?: boolean;
}

export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({
    children,
    className,
    inset = false,
    ...props
}) => {
    return (
        <div
            className={cn(
                "px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-white",
                inset && "pl-8",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

// ==================== DropdownMenuSeparator ====================

interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
    className?: string;
}

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
    className,
    ...props
}) => {
    return (
        <hr
            className={cn(
                "my-1 h-px bg-gray-200 dark:bg-gray-700",
                className
            )}
            {...props}
        />
    );
};

// ==================== DropdownMenuShortcut ====================

interface DropdownMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    className?: string;
}

export const DropdownMenuShortcut: React.FC<DropdownMenuShortcutProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <span
            className={cn(
                "ml-auto text-xs tracking-widest text-gray-400 dark:text-gray-500",
                className
            )}
            {...props}
        />
    );
};

// ==================== DropdownMenuGroup ====================

interface DropdownMenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const DropdownMenuGroup: React.FC<DropdownMenuGroupProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div className={cn("", className)} {...props}>
            {children}
        </div>
    );
};