import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { AuthCard } from '../../components/auth/AuthCard';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const VerificationSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer maxWidth="sm" className="py-12 sm:py-20">
      
      <AuthCard
        title="Account Verified!"
        subtitle="Your email address has been successfully verified."
        icon={ShieldCheck}
      >
        <div className="text-center space-y-6 py-4">
          
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Welcome to CareerConnect</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              Your profile is ready. Let's complete a quick 2-minute setup wizard so recruiters or job listings match your exact target role.
            </p>
          </div>

          <div className="pt-2">
            <PrimaryButton
              onClick={() => navigate('/onboarding')}
              fullWidth
              size="lg"
              icon={Sparkles}
            >
              Start Profile Setup Wizard
            </PrimaryButton>
          </div>

        </div>
      </AuthCard>

    </PageContainer>
  );
};
