// frontend-company/src/components/common/Layout/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Sparkles,
  Building2,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  user: any;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

// Define types for nav items
interface NavItem {
  label: string;
  icon?: any;
  path: string;
  exact?: boolean;
  badge?: number;
  children?: ChildNavItem[];
}

interface ChildNavItem {
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    exact: true
  },
  {
    label: 'Jobs',
    icon: Briefcase,
    path: '/jobs',
    children: [
      { label: 'All Jobs', path: '/jobs' },
      { label: 'Analytics', path: '/jobs/analytics' },
    ]
  },
  {
    label: 'Applications',
    icon: FileText,
    path: '/applications',
    children: [
      { label: 'All Applications', path: '/applications' },
      { label: 'AI Screening', path: '/applications/screening' },
    ]
  },
  {
    label: 'Candidates',
    icon: Users,
    path: '/candidates',
    children: [
      { label: 'All Candidates', path: '/candidates' },
      { label: 'Recommendations', path: '/candidates/recommendations' },
    ]
  },
  {
    label: 'AI Tools',
    icon: Sparkles,
    path: '/ai',
    children: [
      { label: 'AI Dashboard', path: '/ai' },
      { label: 'AI Screening', path: '/ai/screening' },
      { label: 'Job Assistant', path: '/ai/assistant' },
      { label: 'Analytics', path: '/ai/analytics' },
    ]
  },
  {
    label: 'Company',
    icon: Building2,
    path: '/company',
    children: [
      { label: 'Profile', path: '/company/profile' },
      { label: 'Team', path: '/company/team' },
      { label: 'Settings', path: '/settings' },
    ]
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onClose,
  isCollapsed = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isExpanded = (label: string) => expandedItems.includes(label);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-800",
        isCollapsed ? "justify-center" : ""
      )}>
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">JobPortal</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Company Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <div key={item.path}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "w-full flex items-center rounded-lg text-sm font-medium transition-colors",
                    isCollapsed ? "justify-center px-2 py-2" : "justify-between px-3 py-2",
                    isExpanded(item.label)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="text-xs transition-transform duration-200">
                      {isExpanded(item.label) ? '▼' : '▶'}
                    </span>
                  )}
                </button>
                {!isCollapsed && isExpanded(item.label) && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                    {item.children.map((child) => {
                      const isActive = location.pathname === child.path;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                            isActive
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 font-medium"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                          )}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: isActive ? '#3B82F6' : '#9CA3AF'
                            }}
                          />
                          <span>{child.label}</span>
                          {child.badge && (
                            <span className="ml-auto px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                title={isCollapsed ? item.label : undefined}
                end={item.exact}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
        {/* User */}
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium shrink-0">
            {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.fullName || user?.name || 'John Doe'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'john@company.com'}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
            isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};