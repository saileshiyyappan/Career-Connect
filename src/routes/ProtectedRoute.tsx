import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';
import { PageContainer } from '../components/common/PageContainer';
import { EmptyState } from '../components/common/EmptyState';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ShieldAlert } from 'lucide-react';

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/login',
}) => {
  const { role, user, isAuthenticated, isLoading } = useAuth();
  const effectiveRole = user?.role || role;
<<<<<<< HEAD
  const activeRole: UserRole = effectiveRole;
=======
  const isEmpAccount = effectiveRole === 'employer' || user?.email?.toLowerCase() === 'jr.research25@gmail.com';
  const activeRole: UserRole = isEmpAccount ? 'employer' : effectiveRole;
>>>>>>> origin/main

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse">
            Restoring session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && allowedRoles && !allowedRoles.includes('guest')) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return (
      <PageContainer maxWidth="md" className="py-16">
        <EmptyState
          icon={ShieldAlert}
          title="Access Restricted"
          description={`Your current role (${activeRole.replace('_', ' ')}) does not have permission to view this section.`}
          action={
            <div className="flex gap-2">
              <PrimaryButton onClick={() => window.history.back()}>
                Go Back
              </PrimaryButton>
            </div>
          }
        />
      </PageContainer>
    );
  }

  return <Outlet />;
};
