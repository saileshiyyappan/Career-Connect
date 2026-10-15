import React, { useState } from 'react';
import { Link as RouterLink, useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Palette, 
  User, 
  LogOut, 
  ShieldAlert, 
  UserCheck, 
  Building, 
  ChevronDown,
  Bell,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ACCENT_CONFIGS } from '../../constants/designSystem';
import { 
  GUEST_NAV_ITEMS, 
  JOB_SEEKER_NAV_ITEMS, 
  EMPLOYER_NAV_ITEMS, 
  ADMIN_NAV_ITEMS 
} from '../../constants/navigation';
import { AccentColor, UserRole } from '../../types';
import { PrimaryButton } from '../common/PrimaryButton';
import { IconButton } from '../common/IconButton';
import { Avatar } from '../common/Avatar';
import { CareerConnectLogo } from '../common/CareerConnectLogo';
import { Badge } from '../common/Badge';
import { MobileNav } from './MobileNav';
import { showErrorToast } from '../../context/ToastContext';

export const Navbar: React.FC = () => {
  const { user, role, isAuthenticated, isLoading, logout } = useAuth();
  const { resolvedTheme, accent, toggleTheme, setAccent, accentConfig } = useTheme();
  const location = useRouterLocation();
  const navigate = useNavigate();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAccentPickerOpen, setIsAccentPickerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      showErrorToast(`Sign out failed: ${message}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

<<<<<<< HEAD
  const isEmpAccount = user?.role === 'employer' || role === 'employer';
=======
  const isEmpAccount = user?.role === 'employer' || role === 'employer' || user?.email?.toLowerCase() === 'jr.research25@gmail.com';
>>>>>>> origin/main
  const effectiveRole: UserRole = isEmpAccount ? 'employer' : (user?.role || role);

  const getNavItems = () => {
    if (!isAuthenticated || effectiveRole === 'guest' || !user) {
      return GUEST_NAV_ITEMS;
    }
    switch (effectiveRole) {
      case 'job_seeker': return JOB_SEEKER_NAV_ITEMS;
      case 'employer': return EMPLOYER_NAV_ITEMS;
      case 'admin': return ADMIN_NAV_ITEMS;
      default: return GUEST_NAV_ITEMS;
    }
  };

  const navItems = getNavItems();

  const rolesList: { id: UserRole; label: string; icon: React.ElementType }[] = [
    { id: 'guest', label: 'Guest View', icon: User },
    { id: 'job_seeker', label: 'Job Seeker', icon: UserCheck },
    { id: 'employer', label: 'Employer', icon: Building },
    { id: 'admin', label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-clip bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-3">
          
          {/* Logo */}
          <RouterLink to="/" className="flex items-center group shrink-0">
            <CareerConnectLogo variant="horizontal" size="md" />
          </RouterLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink min-w-0">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <RouterLink
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-150 relative shrink-0 ${
                    isActive
                      ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? accentConfig.textClass : ''}`} />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="accent" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-2.5 right-2.5 h-0.5 rounded-full"
                      style={{ backgroundColor: accentConfig.primaryHex }}
                    />
                  )}
                </RouterLink>
              );
            })}
          </nav>

          {/* Right Action Tools: Role Switcher Demo, Theme Toggle, Accent Picker, User Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* Guest Action: Post a Job CTA */}
            {effectiveRole === 'guest' && (
              <RouterLink to="/post-job" className="hidden md:inline-flex shrink-0">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  For Employers
                </button>
              </RouterLink>
            )}

            {/* Accent Color Picker Popover */}
            <div className="relative shrink-0">
              <IconButton
                icon={Palette}
                label="Choose Accent Color"
                variant="ghost"
                size="md"
                onClick={() => setIsAccentPickerOpen(!isAccentPickerOpen)}
              />

              {isAccentPickerOpen && (
                <div className="absolute right-0 mt-2 w-52 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50">
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                    Accent Theme
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(ACCENT_CONFIGS) as AccentColor[]).map((key) => {
                      const cfg = ACCENT_CONFIGS[key];
                      const isSelected = accent === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setAccent(key);
                            setIsAccentPickerOpen(false);
                          }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform cursor-pointer ${
                            isSelected ? 'scale-110 ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900' : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: cfg.primaryHex }}
                          title={cfg.name}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <IconButton
              icon={resolvedTheme === 'dark' ? Sun : Moon}
              label={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              variant="ghost"
              size="md"
              onClick={toggleTheme}
            />

            {/* Auth Actions / Profile Dropdown */}
            {!isAuthenticated || effectiveRole === 'guest' || !user ? (
              <div className="hidden sm:flex items-center gap-2">
                <RouterLink to="/login">
                  <button className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    Sign In
                  </button>
                </RouterLink>
                <RouterLink to="/register">
                  <PrimaryButton size="sm">Register</PrimaryButton>
                </RouterLink>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Avatar src={user?.avatarUrl || user?.photoURL} name={user?.displayName || 'User'} size="sm" isOnline />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user?.displayName}
                        </p>
                        {isLoading ? (
                          <Badge variant="default" size="sm" className="animate-pulse">
                            Loading...
                          </Badge>
                        ) : (
                          <Badge
                            variant={effectiveRole === 'employer' ? 'accent' : effectiveRole === 'admin' ? 'danger' : 'info'}
                            size="sm"
                            className="capitalize"
                          >
                            {effectiveRole.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                    </div>

                    <div className="py-1 max-h-96 overflow-y-auto no-scrollbar">
                      {effectiveRole === 'employer' ? (
                        <>
                          <RouterLink
                            to="/employer/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Building className="w-4 h-4 text-slate-400" />
                            Employer Dashboard
                          </RouterLink>
                          <RouterLink
                            to="/employer/applicants"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <UserCheck className="w-4 h-4 text-slate-400" />
                            Applicants Suite
                          </RouterLink>
                          <RouterLink
                            to="/my-jobs"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            My Jobs
                          </RouterLink>
                          <RouterLink
                            to="/employer/campaigns"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Building className="w-4 h-4 text-slate-400" />
                            Hiring Campaigns
                          </RouterLink>
                          <RouterLink
                            to="/employer/interviews"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Bell className="w-4 h-4 text-slate-400" />
                            Interviews
                          </RouterLink>
                          <RouterLink
                            to="/employer/company"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Building className="w-4 h-4 text-slate-400" />
                            Company Profile
                          </RouterLink>
                          <RouterLink
                            to="/employer/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            Employer Profile
                          </RouterLink>
                          <RouterLink
                            to="/employer/analytics"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Palette className="w-4 h-4 text-slate-400" />
                            Analytics
                          </RouterLink>
                          <RouterLink
                            to="/employer/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            Settings
                          </RouterLink>
                        </>
                      ) : effectiveRole === 'admin' ? (
                        <>
                          <RouterLink
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Building className="w-4 h-4 text-slate-400" />
                            Admin Control Center
                          </RouterLink>
                          <RouterLink
                            to="/admin/users"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            Manage Users
                          </RouterLink>
                          <RouterLink
                            to="/admin/analytics"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Palette className="w-4 h-4 text-slate-400" />
                            System Analytics
                          </RouterLink>
                          <RouterLink
                            to="/admin/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            Admin Settings
                          </RouterLink>
                        </>
                      ) : (
                        <>
                          <RouterLink
                            to="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            My Profile
                          </RouterLink>
                          <RouterLink
                            to="/applications"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Building className="w-4 h-4 text-slate-400" />
                            My Applications
                          </RouterLink>
                          <RouterLink
                            to="/saved-jobs"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            Saved Jobs
                          </RouterLink>
                          <RouterLink
                            to="/interviews"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Bell className="w-4 h-4 text-slate-400" />
                            Interview Center
                          </RouterLink>
                          <RouterLink
                            to="/resumes"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <UserCheck className="w-4 h-4 text-slate-400" />
                            Resume Management
                          </RouterLink>
                          <RouterLink
                            to="/alerts"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Bell className="w-4 h-4 text-slate-400" />
                            Job Match Alerts
                          </RouterLink>
                          <RouterLink
                            to="/insights"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <UserCheck className="w-4 h-4 text-slate-400" />
                            Career Insights
                          </RouterLink>
                          <RouterLink
                            to="/job-preferences"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Palette className="w-4 h-4 text-slate-400" />
                            Job Preferences
                          </RouterLink>
                        </>
                      )}
                    </div>


                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left cursor-pointer disabled:opacity-60"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden">
              <IconButton
                icon={isMobileNavOpen ? X : Menu}
                label="Toggle Navigation Menu"
                variant="ghost"
                size="md"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={navItems}
      />
    </header>
  );
};
