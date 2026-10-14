import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { InputField } from '../../components/inputs/InputField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { AuthCard } from '../../components/auth/AuthCard';
import { ProgressStepper, StepItem } from '../../components/auth/ProgressStepper';
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator';
import { AuthErrorMessage } from '../../components/auth/AuthErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  UserPlus, 
  UserCheck, 
  Building, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { showSuccessToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import { EMPLOYER_POSITIONS } from '../../types/user';

const REGISTER_STEPS: StepItem[] = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Choose Role' },
  { id: 3, label: 'Agreement' },
];

export const RegisterPage: React.FC = () => {
  const { isLoading: authLoading, isAuthenticated, role: userRole, user } = useAuth();
  const effectiveRole = user?.role || userRole;
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<'job_seeker' | 'employer'>('job_seeker');
  const [employerPosition, setEmployerPosition] = useState<string>('');
  
  // Step 1 Form Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 3 Agreements
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (effectiveRole === 'employer') {
        navigate('/employer/dashboard', { replace: true });
      } else if (effectiveRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, effectiveRole, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  // Handle Step 1 Next
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please check again.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setCurrentStep(2);
  };

  // Handle Account Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agreedToTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        firstName,
        lastName,
        email,
        password,
        role,
        employerPosition: role === 'employer' ? employerPosition : undefined,
        agreedToTerms,
      });
      setIsLoading(false);
      showSuccessToast('Account created successfully! Verification email sent.');
      navigate('/verify-email');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <PageContainer maxWidth="sm" className="py-12 sm:py-20">
      
      <AuthCard
        title="Create Your Account"
        subtitle="Join thousands of tech candidates and top hiring managers on CareerConnect."
        icon={UserPlus}
      >

        {/* Multi-Step Stepper */}
        <ProgressStepper steps={REGISTER_STEPS} currentStep={currentStep} className="py-2" />

        {/* Error Alert */}
        <AuthErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />

        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="First Name"
                placeholder="sailesh"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                icon={User}
              />

              <InputField
                label="Last Name"
                placeholder="iyyappan"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <InputField
              label="Email Address"
              type="email"
              placeholder="sailesh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />

            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password && <PasswordStrengthIndicator password={password} />}

            <InputField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={Lock}
            />

            <div className="pt-2">
              <PrimaryButton type="submit" fullWidth size="lg" icon={ArrowRight} iconPosition="right">
                Continue to Account Type
              </PrimaryButton>
            </div>
          </form>
        )}

        {/* STEP 2: Choose Role */}
        {currentStep === 2 && (
          <div className="space-y-6 pt-2">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">What brings you to CareerConnect?</h3>
              <p className="text-xs text-slate-500">Select how you intend to use the platform.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Job Seeker Option */}
              <button
                type="button"
                onClick={() => setRole('job_seeker')}
                className={`p-5 rounded-2xl text-left border transition-all cursor-pointer space-y-3 relative ${
                  role === 'job_seeker'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                {role === 'job_seeker' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 absolute top-4 right-4" />
                )}
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">I'm a Candidate</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Search 12,500+ tech roles, apply in 1-click, and track application responses.
                  </p>
                </div>
              </button>

              {/* Employer Option */}
              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`p-5 rounded-2xl text-left border transition-all cursor-pointer space-y-3 relative ${
                  role === 'employer'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                {role === 'employer' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 absolute top-4 right-4" />
                )}
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">I'm an Employer</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Post job openings, review candidate resumes, and manage applicant pipelines.
                  </p>
                </div>
              </button>

            </div>

            {/* Employer Position Selector (When Employer is selected) */}
            {role === 'employer' && (
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/50 space-y-2 animate-fadeIn">
                <label className="block text-xs font-bold text-purple-900 dark:text-purple-300">
                  Your Role / Position at Organization
                </label>
                <select
                  value={employerPosition}
                  onChange={(e) => setEmployerPosition(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {EMPLOYER_POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  This helps tailor your recruiter dashboard, applicant pipeline permissions, and hiring tools.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <SecondaryButton
                type="button"
                onClick={() => setCurrentStep(1)}
                icon={ArrowLeft}
              >
                Back
              </SecondaryButton>

              <PrimaryButton
                type="button"
                onClick={() => setCurrentStep(3)}
                icon={ArrowRight}
                iconPosition="right"
              >
                Continue
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* STEP 3: Terms & Agreement */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6 pt-2">
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Account Summary
              </div>
              <p>Name: <strong>{firstName} {lastName}</strong></p>
              <p>Email: <strong>{email}</strong></p>
              <p>Role: <strong className="capitalize">{role === 'job_seeker' ? 'Candidate (Job Seeker)' : 'Employer'}</strong></p>
              {role === 'employer' && (
                <p>Position: <strong>{employerPosition}</strong></p>
              )}
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>
                  I agree to CareerConnect’s{' '}
                  <RouterLink to="/terms" target="_blank" className="font-bold text-blue-600 hover:underline">
                    Terms of Service
                  </RouterLink>{' '}
                  and{' '}
                  <RouterLink to="/privacy" target="_blank" className="font-bold text-blue-600 hover:underline">
                    Privacy Policy
                  </RouterLink>.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>
                  Receive weekly job alerts and tech career insights (optional).
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <SecondaryButton
                type="button"
                onClick={() => setCurrentStep(2)}
                icon={ArrowLeft}
              >
                Back
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                icon={UserPlus}
                isLoading={isLoading}
              >
                Create Account
              </PrimaryButton>
            </div>

          </form>
        )}

        {/* Link to Login */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <RouterLink to="/login" className="font-bold text-blue-600 hover:underline">
              Sign in here
            </RouterLink>
          </p>
        </div>

      </AuthCard>

    </PageContainer>
  );
};
