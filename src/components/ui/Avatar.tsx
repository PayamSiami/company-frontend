// src/components/ui/Avatar.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
    delayMs?: number;
}

const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl',
    undefined: 'h-20 w-20 text-2xl',
};

const AvatarContext = React.createContext<{
    size: AvatarProps['size'];
}>({ size: 'md' });

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    fallback,
    size = 'md',
    className,
    children,
    ...props
}) => {
    const [hasError, setHasError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const handleImageError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const showImage = src && !hasError;

    return (
        <AvatarContext.Provider value={{ size }}>
            <div
                className={cn(
                    'relative flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800',
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {showImage && (
                    <img
                        src={src}
                        alt={alt || 'Avatar'}
                        className={cn(
                            'h-full w-full object-cover transition-opacity duration-300',
                            isLoading ? 'opacity-0' : 'opacity-100'
                        )}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                    />
                )}
                {!showImage && children}
                {!showImage && !children && fallback && (
                    <AvatarFallback>{fallback}</AvatarFallback>
                )}
                {!showImage && !children && !fallback && (
                    <AvatarFallback>
                        {alt?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                )}
            </div>
        </AvatarContext.Provider>
    );
};

export const AvatarImage: React.FC<AvatarImageProps> = ({
    src,
    alt,
    className,
    ...props
}) => {
    const [hasError, setHasError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    if (!src || hasError) {
        return null;
    }

    return (
        <img
            src={src}
            alt={alt || 'Avatar'}
            className={cn(
                'h-full w-full object-cover transition-opacity duration-300',
                isLoading ? 'opacity-0' : 'opacity-100',
                className
            )}
            onError={() => {
                setHasError(true);
                setIsLoading(false);
            }}
            onLoad={() => setIsLoading(false)}
            {...props}
        />
    );
};

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
    children,
    className,
    delayMs = 100,
    ...props
}) => {
    const { size } = React.useContext(AvatarContext);
    const [showFallback, setShowFallback] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowFallback(true);
        }, delayMs);

        return () => clearTimeout(timer);
    }, [delayMs]);

    if (!showFallback) {
        return null;
    }

    return (
        <span
            className={cn(
                'flex h-full w-full items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 font-medium text-gray-600 dark:text-gray-300',
                sizeClasses[size || 'md'],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

// Group components for easier imports
export default Avatar;