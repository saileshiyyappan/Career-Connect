import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut, User, Shield, UserCheck, Building } from 'lucide-react';
import { NavItem } from '../../types/layout';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types/user';
import { Badge } from '../common/Badge';
import { PrimaryButton } from '../common/PrimaryButton';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, navItems }) => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { accentConfig } = useTheme();
  const location = useLocation();

  const rolesList: { id: UserRole; label: string }[] = [
    { id: 'guest', label: 'Guest' },
    { id: 'job_seeker', label: 'Job Seeker' },
    { id: 'employer', label: 'Employer' },
    { id: 'admin', label: 'Admin' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative ml-auto w-full max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between z-10 border-l border-slate-200 dark:border-slate-800"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  Career<span style={{ color: accentConfig.primaryHex }}>Connect</span>
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <RouterLink
                      key={item.id}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className={`w-4 h-4 ${isActive ? accentConfig.textClass : ''}`} />}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && <Badge variant="accent" size="sm">{item.badge}</Badge>}
                    </RouterLink>
                  );
                })}
              </div>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {!isAuthenticated || role === 'guest' || !user ? (
                <div className="space-y-2">
                  <RouterLink to="/login" onClick={onClose}>
                    <PrimaryButton fullWidth size="md">
                      Sign In
                    </PrimaryButton>
                  </RouterLink>
                  <RouterLink to="/register" onClick={onClose} className="block text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-1">
                    Create an Account
                  </RouterLink>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user?.displayName}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Exit
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
