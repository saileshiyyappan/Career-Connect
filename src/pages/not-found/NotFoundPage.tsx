import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer maxWidth="md" className="py-20">
      <EmptyState
        icon={Compass}
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        action={
          <PrimaryButton onClick={() => navigate('/')}>
            Back to Home
          </PrimaryButton>
        }
      />
    </PageContainer>
  );
};
