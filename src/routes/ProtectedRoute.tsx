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
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated && allowedRoles && !allowedRoles.includes('guest')) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <PageContainer maxWidth="md" className="py-16">
        <EmptyState
          icon={ShieldAlert}
          title="Access Restricted"
          description={`Your current role (${role.replace('_', ' ')}) does not have permission to view this section.`}
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
