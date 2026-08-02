// frontend-company/src/components/common/Layout/Header.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Monitor,
  X,
  Building2,
  Users,
  Briefcase,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '../UI/DropdownMenu';
import { useTheme } from '../../../context/ThemeContext';

// ✅ Define proper types
interface Notification {
  id: string | number;
  title: string;
  description?: string;
  time: string;
  timeAgo?: string;
  read: boolean;
  link?: string;
  icon?: React.ReactNode;
}

interface User {
  id?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  role?: string;
  company?: string;
}

interface HeaderProps {
  user?: User | null;
  onMenuClick: () => void;
  isMobile?: boolean;
  isCollapsed?: boolean;
  className?: string;
  notifications?: Notification[];
  onNotificationClick?: (id: string | number) => void;
  onMarkAllRead?: () => void;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onMenuClick,
  isCollapsed = false,
  className,
  notifications: externalNotifications,
  onNotificationClick,
  onMarkAllRead,
  onSearch,
  onLogout,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // ✅ Use provided notifications or fallback to default
  const defaultNotifications: Notification[] = [
    { id: 1, title: 'درخواست جدید از جان دو', description: 'برای موقعیت توسعه‌دهنده ارشد', time: '۲ دقیقه پیش', read: false },
    { id: 2, title: 'داوطلب جین اسمیت انتخاب شد', description: 'برای مرحله مصاحبه', time: '۱ ساعت پیش', read: false },
    { id: 3, title: 'مصاحبه برنامه‌ریزی شد', description: 'برای توسعه‌دهنده ارشد', time: '۳ ساعت پیش', read: true },
    { id: 4, title: 'غربالگری هوش مصنوعی تکمیل شد', description: 'برای ۵ داوطلب', time: '۵ ساعت پیش', read: true },
  ];

  const notifications = externalNotifications || defaultNotifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  // ✅ Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      // Escape to close search
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // ✅ Handle search with debounce
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  }, [onSearch]);

  // ✅ Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchOpen(false);
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  // ✅ Handle logout
  const handleLogout = useCallback(() => {
    if (window.confirm('آیا از خروج خود اطمینان دارید؟')) {
      if (onLogout) {
        onLogout();
      } else {
        // Default logout behavior
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [onLogout, navigate]);

  // ✅ Get theme icon
  const themeIcon = useMemo(() => {
    switch (theme) {
      case 'dark':
        return <Moon className="w-5 h-5 text-gray-500" />;
      case 'light':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'system':
        return <Monitor className="w-5 h-5 text-blue-500" />;
      default:
        return <Monitor className="w-5 h-5 text-gray-500" />;
    }
  }, [theme]);

  // ✅ Get user initials
  const userInitials = useMemo(() => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.fullName.substring(0, 2).toUpperCase();
  }, [user]);

  // ✅ Get user role badge
  const userRole = useMemo(() => {
    if (!user?.role) return null;
    const roleMap: Record<string, string> = {
      employer: 'کارفرما',
    };
    return roleMap[user.role] || user.role;
  }, [user]);

  // ✅ Handle notification click
  const handleNotificationClick = useCallback((notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  }, [onNotificationClick, navigate]);

  // ✅ Handle mark all as read
  const handleMarkAllRead = useCallback(() => {
    if (onMarkAllRead) {
      onMarkAllRead();
    }
  }, [onMarkAllRead]);

  // ✅ Notification items renderer
  const renderNotificationItems = useMemo(() => {
    if (notifications.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p className="text-sm">هیچ اعلانی وجود ندارد</p>
          <p className="text-xs text-gray-400 mt-1">اعلان‌های جدید در اینجا ظاهر می‌شوند</p>
        </div>
      );
    }

    return notifications.slice(0, 10).map((n) => (
      <DropdownMenuItem
        key={n.id}
        className={cn(
          "flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 w-full",
          !n.read && "bg-blue-50/50 dark:bg-blue-900/10"
        )}
        onClick={() => handleNotificationClick(n)}
      >
        <div className="flex items-start gap-3 w-full">
          <div className={cn(
            "w-2 h-2 mt-1.5 rounded-full shrink-0",
            n.read ? "bg-gray-300 dark:bg-gray-600" : "bg-blue-500"
          )} />
          <div className="flex-1 text-right min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
              {n.title}
            </p>
            {n.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                {n.description}
              </p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {n.time || n.timeAgo}
            </p>
          </div>
          {n.icon && (
            <div className="shrink-0 mt-0.5">
              {n.icon}
            </div>
          )}
        </div>
      </DropdownMenuItem>
    ));
  }, [notifications, handleNotificationClick]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50",
        className
      )}
      dir="rtl"
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left side - Menu and Search */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className={cn(
              "p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              "lg:hidden"
            )}
            aria-label={isCollapsed ? 'باز کردن منو' : 'بستن منو'}
          >
            <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center relative flex-1 max-w-md">
            <Search className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="جستجوی مشاغل، داوطلبان یا درخواست‌ها..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "w-full pr-9 pl-4 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800/50",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                "transition-all text-right",
                isSearchFocused ? "border-blue-500" : "border-gray-200 dark:border-gray-700"
              )}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute left-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="پاک کردن جستجو"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {!searchQuery && (
              <kbd className="absolute left-3 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          {/* Search toggle (mobile) */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
            aria-label="جستجو"
          >
            {searchOpen ? (
              <X className="w-5 h-5 text-gray-500" />
            ) : (
              <Search className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="تغییر تم"
              >
                {themeIcon}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>تم نمایش</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={cn('gap-2 cursor-pointer', theme === 'light' && 'bg-blue-50 dark:bg-blue-900/20')}
                onClick={() => setTheme('light')}
              >
                <Sun className="w-4 h-4" />
                <span>حالت روز</span>
                {theme === 'light' && (
                  <span className="mr-auto text-xs text-blue-600 dark:text-blue-400">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn('gap-2 cursor-pointer', theme === 'dark' && 'bg-blue-50 dark:bg-blue-900/20')}
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-4 h-4" />
                <span>حالت شب</span>
                {theme === 'dark' && (
                  <span className="mr-auto text-xs text-blue-600 dark:text-blue-400">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn('gap-2 cursor-pointer', theme === 'system' && 'bg-blue-50 dark:bg-blue-900/20')}
                onClick={() => setTheme('system')}
              >
                <Monitor className="w-4 h-4" />
                <span>تنظیمات سیستم</span>
                {theme === 'system' && (
                  <span className="mr-auto text-xs text-blue-600 dark:text-blue-400">✓</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* AI Assistant quick access */}
          <Link to="/ai/assistant" className="hidden md:block">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>دستیار هوش مصنوعی</span>
            </Button>
          </Link>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={`اعلان‌ها (${unreadCount} عدد خوانده نشده)`}
              >
                <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-medium text-white bg-red-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 max-h-[80vh] overflow-y-auto">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>اعلان‌ها</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    علامت‌گذاری همه
                  </button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {renderNotificationItems}
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
                    onClick={() => navigate('/notifications')}
                  >
                    مشاهده همه اعلان‌ها
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="منوی کاربر"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium shrink-0">
                  {userInitials}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col text-right">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user?.fullName || 'کاربر'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || 'user@company.com'}
                  </span>
                  {userRole && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                      {userRole}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4" />
                  <span>پروفایل</span>
                  <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/company')}>
                  <Building2 className="w-4 h-4" />
                  <span>شرکت</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/jobs')}>
                  <Briefcase className="w-4 h-4" />
                  <span>مشاغل</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/candidates')}>
                  <Users className="w-4 h-4" />
                  <span>داوطلبان</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4" />
                <span>تنظیمات</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/help')}>
                <HelpCircle className="w-4 h-4" />
                <span>راهنما و پشتیبانی</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-red-600 dark:text-red-400 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
                <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="md:hidden p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pr-9 text-right"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;