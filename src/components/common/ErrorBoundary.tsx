
import  { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Button } from './UI/Button';
import { AlertCircle, Home } from 'lucide-react';
import { NODE_ENV } from '../../config/env';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleRefresh = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render(): ReactNode {
        const { hasError, error, errorInfo } = this.state;
        const { children, fallback } = this.props;

        if (hasError) {
            if (fallback) {
                return fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
                    <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-8 text-center">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-2xl">
                            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                            Something went wrong
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
                        </p>

                        {NODE_ENV === 'development' && error && (
                            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-left overflow-auto max-h-48">
                                <p className="text-sm font-mono text-red-600 dark:text-red-400 wrap-break-word">
                                    {error.toString()}
                                </p>
                                {errorInfo && (
                                    <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                        {errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                            Error ID: {Math.random().toString(36).substring(7)}
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={this.handleGoHome}
                                className="gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </Button>
                        </div>

                        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                            If you continue to see this error, please{' '}
                            <button
                                onClick={() => window.location.href = 'mailto:support@jobportal.com'}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                            >
                                contact support
                            </button>
                        </p>
                    </div>
                </div>
            );
        }

        return children;
    }
}

export default ErrorBoundary;