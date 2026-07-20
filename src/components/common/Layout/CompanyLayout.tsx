// frontend-company/src/components/common/Layout/CompanyLayout.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  ChevronLeft as ChevronLeftIcon,
  Activity,
  X
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Badge } from '../UI/Badge';

interface CompanyLayoutProps {
  children?: React.ReactNode;
}

// Improved Breadcrumb component with Farsi support
const Breadcrumb: React.FC<{ pathname: string }> = ({ pathname }) => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Link 
          to="/dashboard" 
          className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <Home className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Farsi translation mapping for common paths
  const getFarsiLabel = (segment: string): string => {
    const translations: Record<string, string> = {
      'dashboard': 'داشبورد',
      'jobs': 'مشاغل',
      'create': 'ایجاد',
      'applications': 'درخواست‌ها',
      'candidates': 'داوطلبان',
      'profile': 'پروفایل',
      'settings': 'تنظیمات',
      'analytics': 'تحلیل‌ها',
      'screening': 'غربالگری',
      'ai': 'هوش مصنوعی',
      'reports': 'گزارش‌ها',
      'team': 'تیم',
      'messages': 'پیام‌ها',
      'notifications': 'اعلان‌ها',
      'calendar': 'تقویم',
      'documents': 'اسناد',
      'interviews': 'مصاحبه‌ها',
      'offers': 'پیشنهادات',
      'onboarding': 'آماده‌سازی',
    };
    return translations[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  };

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="مسیر راهنما">
      <Link 
        to="/dashboard" 
        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
      >
        <Home className="w-4 h-4" />
      </Link>
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const label = getFarsiLabel(segment);

        return (
          <React.Fragment key={path}>
            <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 shrink-0" />
            {isLast ? (
              <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-50">
                {label}
              </span>
            ) : (
              <Link
                to={path}
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 truncate max-w-37.5"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export const CompanyLayout: React.FC<CompanyLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setIsCollapsed(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    // Scroll to top on route change
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location, isMobile]);

  // Keyboard shortcut for sidebar toggle (Ctrl+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, sidebarOpen, isCollapsed]);

  const toggleSidebar = useCallback(() => {
    setIsTransitioning(true);
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isMobile, sidebarOpen, isCollapsed]);

  const getSidebarWidth = () => {
    if (isMobile) return sidebarOpen ? 'w-72' : 'w-0';
    return isCollapsed ? 'w-20' : 'w-72';
  };

  const getContentMargin = () => {
    if (isMobile) return 'mr-0';
    return isCollapsed ? 'mr-20' : 'mr-72';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-blue-50/30 dark:from-gray-950 dark:to-blue-950/30" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg animate-pulse shadow-lg shadow-blue-500/25" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">
            در حال بارگذاری داشبورد شما...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50" dir="rtl">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 ease-in-out shadow-xl shadow-gray-200/20 dark:shadow-gray-950/20",
          getSidebarWidth(),
          isMobile && !sidebarOpen && "translate-x-full"
        )}
        aria-label="ناوبری کناری"
      >
        <Sidebar
          user={user}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>

      {/* Main content */}
      <div
        ref={mainRef}
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          getContentMargin()
        )}
      >
        {/* Header */}
        <Header
          user={user}
          onMenuClick={toggleSidebar}
          isMobile={isMobile}
          isCollapsed={isCollapsed}
        />

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb area - Improved with Farsi */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-800/50">
              <Breadcrumb pathname={location.pathname} />

              <div className="flex items-center gap-3">
                {/* AI Status Badge */}
                <Badge variant="info" size="sm" className="hidden sm:flex items-center gap-1.5 px-3 py-1">
                  <Activity className="w-3 h-3" />
                  <span className="hidden md:inline">هوش مصنوعی فعال</span>
                </Badge>

                {/* Live indicator */}
                <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="hidden sm:inline font-medium">زنده</span>
                </div>

                {/* Page indicator - shows current section */}
                <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <span className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                  <span className="font-mono">
                    {location.pathname.split('/').filter(Boolean).length > 0 
                      ? location.pathname.split('/').filter(Boolean).map(getFarsiLabel).join(' / ')
                      : 'داشبورد'}
                  </span>
                </div>
              </div>
            </div>

            {/* Page content with fade-in animation */}
            <div className="animate-fade-in">
              {children || <Outlet />}
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer variant="compact" />
      </div>

      {/* Floating toggle button (desktop) - Improved positioning for RTL */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className={cn(
            "fixed z-40 bottom-6 p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group",
            isCollapsed ? "right-24" : "right-70",
            isTransitioning && "opacity-50 pointer-events-none"
          )}
          aria-label={isCollapsed ? "باز کردن نوار کناری" : "بستن نوار کناری"}
          title={isCollapsed ? "باز کردن نوار کناری (Ctrl+B)" : "بستن نوار کناری (Ctrl+B)"}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          )}
        </button>
      )}

      {/* Mobile menu button - Improved for RTL */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group"
          aria-label="باز کردن منو"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile close button - for RTL */}
      {isMobile && sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="بستن منو"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Keyboard shortcut hint - Improved for RTL */}
      {!isMobile && !isCollapsed && (
        <div className="fixed bottom-6 left-6 z-30 text-xs text-gray-400 dark:text-gray-500 bg-white/95 dark:bg-gray-900/95 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm select-none flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            Ctrl
          </kbd>
          <span className="text-gray-400">+</span>
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            B
          </kbd>
          <span className="mr-1 text-gray-400 hidden sm:inline">تغییر وضعیت</span>
        </div>
      )}

      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <div className="absolute inset-0 bg-gray-900/5 dark:bg-white/5 animate-fade-in" />
        </div>
      )}
    </div>
  );
};

// Helper function for Farsi translation
const getFarsiLabel = (segment: string): string => {
  const translations: Record<string, string> = {
    'dashboard': 'داشبورد',
    'jobs': 'مشاغل',
    'create': 'ایجاد',
    'applications': 'درخواست‌ها',
    'candidates': 'داوطلبان',
    'profile': 'پروفایل',
    'settings': 'تنظیمات',
    'analytics': 'تحلیل‌ها',
    'screening': 'غربالگری',
    'ai': 'هوش مصنوعی',
    'reports': 'گزارش‌ها',
    'team': 'تیم',
    'messages': 'پیام‌ها',
    'notifications': 'اعلان‌ها',
    'calendar': 'تقویم',
    'documents': 'اسناد',
    'interviews': 'مصاحبه‌ها',
    'offers': 'پیشنهادات',
    'onboarding': 'آماده‌سازی',
  };
  return translations[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
};

export default CompanyLayout;